// The 3D page is the source for both / and /3d/. Its assets use root-relative URLs.
import { readFile, writeFile } from 'node:fs/promises';

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
if (!html.includes('href="/3d/styles.css"') || !html.includes('src="/3d/app.js"')) {
  throw new Error('The homepage template must use root-relative 3D asset URLs.');
}
await writeFile(new URL('../index.html', import.meta.url), html);
console.log('Synced the root homepage from 3d/index.html.');
