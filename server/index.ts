import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase, isDatabaseConfigured } from './db';
import { ForecastSnapshot } from './models/ForecastSnapshot';
import { PipelineRun } from './models/PipelineRun';

const app = express();
const port = Number(process.env.PORT || 4000);
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    runtime: 'express-mern',
    database: isDatabaseConfigured() ? 'configured' : 'not-configured',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/snapshots/:subdivisionId', async (req, res) => {
  if (!isDatabaseConfigured()) {
    return res.status(503).json({ error: 'MongoDB is not configured. Set MONGODB_URI to enable persistence.' });
  }

  try {
    await connectDatabase();
    const snapshots = await ForecastSnapshot.find({ subdivisionId: req.params.subdivisionId })
      .sort({ fetchedAt: -1 })
      .limit(20)
      .lean();
    return res.json({ snapshots });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load forecast snapshots', message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/snapshots', async (req, res) => {
  if (!isDatabaseConfigured()) {
    return res.status(503).json({ error: 'MongoDB is not configured. Set MONGODB_URI to enable persistence.' });
  }

  const { subdivisionId, subdivisionName, fetchedAt, payload } = req.body || {};
  if (!subdivisionId || !subdivisionName || !payload) {
    return res.status(400).json({ error: 'subdivisionId, subdivisionName, and payload are required' });
  }

  try {
    await connectDatabase();
    const snapshot = await ForecastSnapshot.create({
      subdivisionId,
      subdivisionName,
      fetchedAt: fetchedAt ? new Date(fetchedAt) : new Date(),
      payload
    });
    return res.status(201).json({ snapshot });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save forecast snapshot', message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.get('/api/pipeline/runs', async (_req, res) => {
  if (!isDatabaseConfigured()) {
    return res.json({ runs: [], persistence: 'disabled' });
  }

  try {
    await connectDatabase();
    const runs = await PipelineRun.find().sort({ completedAt: -1 }).limit(20).lean();
    return res.json({ runs });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load pipeline runs', message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

const frontendPath = path.resolve(currentDirectory, '../dist');
app.use(express.static(frontendPath));
app.get('*', (_req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

app.listen(port, () => {
  console.log(`VARUN-Blend MERN server listening on http://localhost:${port}`);
});
