import { createServer } from 'node:http';
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const IGNORED = new Set(['libraries', 'site', 'thumbs', 'scripts', 'node_modules']);
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.obj': 'text/plain',
};

const args = process.argv.slice(2);
const skipShots = args.includes('--no-shots');
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

const exists = (p) => access(p).then(() => true, () => false);
const prettify = (name) =>
  name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase());

async function findProjects() {
  const entries = await readdir(root, { withFileTypes: true });
  const dirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !IGNORED.has(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  const projects = [];
  for (const name of dirs) if (await exists(join(root, name, 'index.html'))) projects.push(name);
  return projects;
}

function serve() {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const file = join(root, path.endsWith('/') ? path + 'index.html' : path);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, () => ok(server)));
}

async function screenshot(names) {
  const { default: puppeteer } = await import('puppeteer');
  const server = await serve();
  const base = `http://localhost:${server.address().port}`;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  await mkdir(join(root, 'thumbs'), { recursive: true });
  for (const name of names) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    page.on('pageerror', (e) => console.warn(`  [${name}] ${e.message}`));
    await page.goto(`${base}/${name}/index.html`, { waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise((r) => setTimeout(r, 4000));
    await page.screenshot({ path: join(root, 'thumbs', `${name}.png`) });
    await page.close();
    console.log(`thumb ${name}`);
  }
  await browser.close();
  server.close();
}

const projects = await findProjects();
if (!skipShots) await screenshot(only ? projects.filter((p) => p === only) : projects);

const manifest = [];
for (const name of projects) {
  const hasThumb = await exists(join(root, 'thumbs', `${name}.png`));
  manifest.push({ name, title: prettify(name), thumb: hasThumb ? `thumbs/${name}.png` : null });
}
await mkdir(join(root, 'site'), { recursive: true });
await writeFile(join(root, 'site', 'projects.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`wrote site/projects.json (${manifest.length} projects)`);
