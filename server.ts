import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/apiRoutes.ts';
import { syncFromSupabaseToLocal } from './server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount API routes
  app.use('/api', apiRouter);

  // Direct download for Netlify Deploy Ready ZIP
  app.get('/download-deploy-zip', (req, res) => {
    const zipPath = path.join(process.cwd(), 'netlify_deploy.zip');
    res.download(zipPath, 'mychse_netlify_deploy.zip');
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MY CHSE 12TH CLASSES server running on http://0.0.0.0:${PORT}`);
    syncFromSupabaseToLocal().then((synced) => {
      if (synced > 0) {
        console.log(`Initial boot: synced ${synced} existing students from Supabase to local cache.`);
      }
    }).catch((e) => console.warn('Supabase initial sync error:', e));
  });
}

startServer();
