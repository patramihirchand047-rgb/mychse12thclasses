import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Dist directory does not exist yet.');
  process.exit(0);
}

try {
  // 1. Bundle serverless function into dist for Netlify Drop compatibility
  console.log('Bundling Netlify serverless function...');
  const netlifyFuncDir = path.join(distDir, '.netlify', 'functions');
  const fallbackFuncDir = path.join(distDir, 'netlify', 'functions');
  fs.mkdirSync(netlifyFuncDir, { recursive: true });
  fs.mkdirSync(fallbackFuncDir, { recursive: true });

  execSync(
    'npx esbuild netlify/functions/api.ts --bundle --platform=node --target=node20 --format=cjs --outfile=dist/.netlify/functions/api.js',
    { stdio: 'inherit' }
  );
  fs.copyFileSync(
    path.join(netlifyFuncDir, 'api.js'),
    path.join(fallbackFuncDir, 'api.js')
  );

  // 2. Ensure netlify.toml is included in dist
  if (fs.existsSync('netlify.toml')) {
    fs.copyFileSync('netlify.toml', path.join(distDir, 'netlify.toml'));
  }

  // 3. Create deployment zip
  const pyScript = `import zipfile, os; z = zipfile.ZipFile('netlify_deploy.zip', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), 'dist')) for r, d, files in os.walk('dist') for f in files if f != 'netlify_deploy.zip']; z.close()`;
  execSync(`python3 -c "${pyScript}"`, { stdio: 'inherit' });
  if (fs.existsSync('netlify_deploy.zip')) {
    fs.copyFileSync('netlify_deploy.zip', path.join(distDir, 'netlify_deploy.zip'));
    console.log('✅ netlify_deploy.zip successfully created & placed in dist/ with pre-bundled API!');
  }
} catch (e) {
  console.warn('Zip creation note:', e);
}
