import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Dist directory does not exist yet.');
  process.exit(0);
}

try {
  const pyScript = `import zipfile, os; z = zipfile.ZipFile('netlify_deploy.zip', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), 'dist')) for r, d, files in os.walk('dist') for f in files if f != 'netlify_deploy.zip']; z.close()`;
  execSync(`python3 -c "${pyScript}"`, { stdio: 'inherit' });
  if (fs.existsSync('netlify_deploy.zip')) {
    fs.copyFileSync('netlify_deploy.zip', path.join(distDir, 'netlify_deploy.zip'));
    console.log('✅ netlify_deploy.zip successfully created & placed in dist/!');
  }
} catch (e) {
  console.warn('Zip creation note:', e);
}
