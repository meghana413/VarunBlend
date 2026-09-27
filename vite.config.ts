import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, Plugin } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function vercelApiDevPlugin(): Plugin {
  return {
    name: "vercel-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        const url = new URL(req.url, "http://localhost");
        const pathname = url.pathname;

        let handlerModule: any = null;
        try {
          if (pathname === "/api/health") {
            handlerModule = await import("./api/health.ts");
          } else if (pathname === "/api/forecast/subdivisions") {
            handlerModule = await import("./api/forecast/subdivisions.ts");
          } else if (pathname === "/api/forecast/blend") {
            handlerModule = await import("./api/forecast/blend.ts");
          } else if (pathname === "/api/forecast/verification") {
            handlerModule = await import("./api/forecast/verification.ts");
          } else if (pathname === "/api/pipeline/run") {
            handlerModule = await import("./api/pipeline/run.ts");
          } else if (pathname === "/api/bulletin/ai-brief") {
            handlerModule = await import("./api/bulletin/ai-brief.ts");
          }

          if (handlerModule && handlerModule.default) {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", async () => {
              try {
                (req as any).body = body ? JSON.parse(body) : {};
              } catch {
                (req as any).body = body;
              }
              (req as any).query = Object.fromEntries(
                url.searchParams.entries(),
              );

              (res as any).status = function (statusCode: number) {
                res.statusCode = statusCode;
                return res;
              };
              (res as any).json = function (jsonObj: any) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(jsonObj));
                return res;
              };

              try {
                await handlerModule.default(req, res);
              } catch (err: any) {
                console.error("[API Dev Server Handler Error]:", err);
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: err?.message || "Serverless error" }),
                );
              }
            });
            return;
          }
        } catch (err) {
          console.error("[API Dev Server Route Match Error]:", err);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
