#!/usr/bin/env node
// Turn a vault markdown OR HTML file into a branded PDF.
//
//   node tools/pdf/make-pdf.mjs <input.md|input.html> [--draft] [--out <output.pdf>]
//
// The source file is the master; the PDF is an output built beside it.
// Pipeline: markdown → HTML (marked, via npx) → PDF (Edge headless).
// A designed HTML page skips the first half entirely and is printed as it
// stands — routing it through markdown would throw away the layout, which is
// most of what such a page is for.
//
// Nothing here needs admin rights and nothing installs into the vault — the
// intermediate HTML and the browser scratch profile go to the OS temp folder,
// so OneDrive never syncs build junk.
//
// Layout problems in a markdown document are fixed in the markdown, never by
// editing the CSS below.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Pinned exact so every machine builds identical output and the npx cache is
// hit offline after the first run. 18.0.9 published 2026-08-04 — respects the
// "never install a release younger than 7 days" rule. Bump deliberately.
const MARKED_VERSION = '18.0.9';

// Brand. ACCENT is a placeholder navy until the real brand colour is supplied;
// drop the real logo in this folder as logo.png and it appears on page one.
const ACCENT = '#1F3A5F';
const LOGO_PATH = join(dirname(fileURLToPath(import.meta.url)), 'logo.png');

const win = process.platform === 'win32';

function fail(msg) {
  console.error(`make-pdf: ${msg}`);
  process.exit(1);
}

// --- arguments ---------------------------------------------------------------
const args = process.argv.slice(2);
const draft = args.includes('--draft');
let outPath = null;
const outIdx = args.indexOf('--out');
if (outIdx !== -1) {
  outPath = args[outIdx + 1] || fail('--out needs a path');
  args.splice(outIdx, 2);
}
const inputArg = args.filter((a) => a !== '--draft')[0];
if (!inputArg) fail('usage: node tools/pdf/make-pdf.mjs <input.md|input.html> [--draft] [--out <output.pdf>]');
const srcPath = resolve(inputArg);
if (!existsSync(srcPath)) fail(`no such file: ${srcPath}`);
if (!outPath) outPath = join(dirname(srcPath), basename(srcPath, extname(srcPath)) + '.pdf');

const srcDir = dirname(srcPath);
const isHtmlInput = /\.html?$/i.test(srcPath);
let src = readFileSync(srcPath, 'utf8');

// A complete HTML document carries its own design. Print it as it stands
// rather than pouring it into the branded shell below.
const isFullDocument = isHtmlInput && /<html[\s>]|<!doctype html/i.test(src);

let body;
let docTitle;

if (isHtmlInput) {
  body = src;
  const t = src.match(/<title[^>]*>([^<]+)<\/title>/i) || src.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  docTitle = t ? t[1].trim() : basename(srcPath, extname(srcPath));
} else {
  // --- markdown → print-ready markdown ---------------------------------------
  src = src.replace(/^---\n[\s\S]*?\n---\n/, ''); // strip YAML frontmatter

  // Flatten wikilinks: [[target|display]] → display, [[target]] → humanised target.
  src = src.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1');
  src = src.replace(/\[\[([^\]]+)\]\]/g, (_, t) =>
    t.split('/').pop().replace(/[-_]/g, ' ').trim());

  const titleMatch = src.match(/^#\s+(.+)$/m);
  docTitle = titleMatch ? titleMatch[1].trim() : basename(srcPath, extname(srcPath));

  // --- markdown → HTML body (marked, pinned, via npx) ------------------------
  // npx lives beside node.exe (the setup unpacks them together), and before the
  // mid-install restart neither is on PATH — so prefer the sibling of the very
  // node running this script. Content goes via stdin/stdout, so no file-path
  // arguments reach the shell.
  //
  // 🔴 npx re-invokes a BARE `node`, so calling npx by full path is not enough:
  // the child still has to find the runtime on PATH. Prepending our own runtime
  // directory for this one call is what makes the tool work before the restart.
  // Without it this fails as: '"node"' is not recognized as an internal or
  // external command — an error that names neither the cause nor the fix.
  const nodeDir = dirname(process.execPath);
  const npxSibling = join(nodeDir, win ? 'npx.cmd' : 'npx');
  const npxCmd = existsSync(npxSibling) ? npxSibling : 'npx';
  const childEnv = { ...process.env, PATH: `${nodeDir}${win ? ';' : ':'}${process.env.PATH || ''}` };
  const marked = spawnSync(
    win ? `"${npxCmd}"` : npxCmd,
    ['-y', `marked@${MARKED_VERSION}`, '--gfm'],
    { input: src, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: win, env: childEnv },
  );
  if (marked.status !== 0 || !marked.stdout) {
    fail(`markdown conversion failed — is Node/npx working, and has npx fetched marked once with network?\n${marked.stderr || ''}`);
  }
  body = marked.stdout;
}

// --- embed local images as data URIs so the HTML is self-contained ------------
// Applies to both inputs: the page is printed from the temp folder, so relative
// image paths would otherwise break the moment it moves.
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
body = body.replace(/<img[^>]+>/g, (tag) => {
  const src2 = tag.match(/src="([^"]+)"/);
  if (!src2 || src2[1].startsWith('data:') || /^[a-z]+:\/\//.test(src2[1])) return tag;
  const imgPath = resolve(srcDir, decodeURIComponent(src2[1]));
  if (!existsSync(imgPath)) return tag;
  const b64 = readFileSync(imgPath).toString('base64');
  const type = mime[extname(imgPath).toLowerCase()] || 'image/png';
  return tag.replace(src2[0], `src="data:${type};base64,${b64}"`);
});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const logoHtml = existsSync(LOGO_PATH)
  ? `<div class="logo"><img src="data:image/png;base64,${readFileSync(LOGO_PATH).toString('base64')}" alt=""></div>`
  : '';
// position:fixed repeats on every printed page in Chromium — that is the
// whole watermark mechanism.
const watermarkHtml = draft ? '<div class="watermark">DRAFT</div>' : '';

// --- the branded shell --------------------------------------------------------
const brandedHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${esc(docTitle)}</title>
<style>
  @page { size: A4; margin: 2.2cm 2cm; }
  body {
    font-family: "Segoe UI", -apple-system, "Helvetica Neue", Arial, sans-serif;
    font-size: 10.5pt; line-height: 1.55; color: #1a1a1a; margin: 0;
  }
  .logo { text-align: right; margin-bottom: 1.2em; }
  .logo img { height: 38px; }
  h1, h2, h3, h4 { color: ${ACCENT}; line-height: 1.25; break-after: avoid; }
  h1 { font-size: 20pt; border-bottom: 2px solid ${ACCENT}; padding-bottom: 0.3em; margin-top: 0; }
  h2 { font-size: 14pt; margin-top: 1.6em; }
  h3 { font-size: 11.5pt; margin-top: 1.3em; }
  p { margin: 0.7em 0; }
  a { color: ${ACCENT}; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; break-inside: avoid; font-size: 10pt; }
  th { background: ${ACCENT}; color: #fff; text-align: left; padding: 6px 10px; }
  td { border-bottom: 1px solid #d8d8d8; padding: 6px 10px; vertical-align: top; }
  tr:nth-child(even) td { background: #f6f7f9; }
  blockquote { border-left: 3px solid ${ACCENT}; margin: 1em 0; padding: 0.2em 1.2em; color: #444; break-inside: avoid; }
  code { font-family: Consolas, Menlo, monospace; font-size: 9.5pt; background: #f2f2f4; padding: 1px 4px; border-radius: 3px; }
  pre { background: #f2f2f4; padding: 12px; border-radius: 4px; overflow-x: hidden; white-space: pre-wrap; break-inside: avoid; }
  pre code { background: none; padding: 0; }
  img { max-width: 100%; height: auto; break-inside: avoid; }
  ul, ol { padding-left: 1.5em; }
  li { margin: 0.25em 0; }
  hr { border: none; border-top: 1px solid #d8d8d8; margin: 2em 0; }
  .watermark {
    position: fixed; top: 40%; left: 8%; transform: rotate(-30deg);
    font-size: 90pt; font-weight: 700; color: rgba(180, 30, 30, 0.10);
    letter-spacing: 0.1em; z-index: -1;
  }
</style>
</head>
<body>
${watermarkHtml}
${logoHtml}
${body}
</body>
</html>
`;

// A designed page keeps its own document; the DRAFT watermark is still injected
// so a draft of a designed page is still visibly a draft.
const html = isFullDocument
  ? body.replace(/<body([^>]*)>/i, `<body$1>${watermarkHtml}`)
  : brandedHtml;

// --- HTML → PDF (Edge headless; Chrome as the fallback on a Mac) --------------
const scratch = join(tmpdir(), 'vault-make-pdf');
mkdirSync(scratch, { recursive: true });
const htmlPath = join(scratch, basename(srcPath, extname(srcPath)) + '.html');
writeFileSync(htmlPath, html, 'utf8');

const candidates = win
  ? [
      process.env.VAULT_BROWSER_PATH,
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      join(process.env.LOCALAPPDATA || '', 'Microsoft\\Edge\\Application\\msedge.exe'),
    ]
  : [
      process.env.VAULT_BROWSER_PATH,
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ];
const browser = candidates.filter(Boolean).find((p) => existsSync(p));
if (!browser) fail('no Edge (or Chrome) found — set VAULT_BROWSER_PATH to the browser executable');

// A scratch --user-data-dir keeps headless printing independent of the copy of
// Edge they almost certainly have open right now. Verified 20 Aug: the browser
// writes the PDF within seconds but can then hang around instead of exiting —
// so success is "the output file exists and has stopped growing", polled below,
// and the browser is killed once that is true. Never wait on the process exiting.
rmSync(resolve(outPath), { force: true });
// Each run gets its own profile dir: a killed browser leaves a stale
// SingletonLock behind, and the next run must not queue up behind it.
const profile = join(scratch, `profile-${process.pid}`);
const child = spawn(
  browser,
  [
    '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    '--no-pdf-header-footer',
    `--print-to-pdf=${resolve(outPath)}`,
    pathToFileURL(htmlPath).href,
  ],
  { stdio: 'ignore' },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastSize = -1;
let done = false;
for (let waited = 0; waited < 120_000; waited += 500) {
  await sleep(500);
  if (existsSync(outPath)) {
    const size = statSync(outPath).size;
    if (size > 0 && size === lastSize) { done = true; break; }
    lastSize = size;
  }
}
child.kill();
// Scratch-profile cleanup is best-effort: the killed browser releases its files
// asynchronously, and a leftover under the OS temp dir is harmless.
await sleep(1000);
try { rmSync(profile, { recursive: true, force: true }); } catch { /* temp dir */ }
if (!done) fail('the browser did not produce a PDF within two minutes');
console.log(`built ${outPath}${draft ? ' (DRAFT watermark)' : ''}`);
