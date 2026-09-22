export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  
  return res.status(200).json({
    status: 'ok',
    deployment: 'Vercel Serverless Functions (No Database)',
    system: 'VARUN-Blend SIH26081 Hybrid AI-NWP Multi-Model Blending System',
    timestamp: new Date().toISOString()
  });
}
