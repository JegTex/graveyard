import { put, list, del } from '@vercel/blob';

// Each section is one small JSON file in Blob storage: sections/<id>-<random>.json.
// Edits write a new file and delete the old one, so no cached copy is ever served stale.

const TYPES = ['Hero', 'Nav', 'Features', 'About', 'Testimonials', 'Pricing', 'FAQ', 'CTA', 'Footer', 'Gallery', 'Contact', 'Other'];
const isBlobUrl = (u) => typeof u === 'string' && /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i.test(u);
const str = (v, n) => String(v ?? '').trim().slice(0, n);
const arr = (v, n) => (Array.isArray(v) ? v.map((x) => str(x, 24)).filter(Boolean).slice(0, n) : []);

function clean(input) {
  return {
    name: str(input.name, 80) || 'Untitled section',
    type: TYPES.includes(input.type) ? input.type : 'Other',
    colours: arr(input.colours, 13),
    style: arr(input.style, 20),
    client: str(input.client, 60),
    project: str(input.project, 80),
    year: str(input.year, 4),
    notes: str(input.notes, 500),
    fileKey: /^[0-9a-zA-Z]{22,128}$/.test(input.fileKey || '') ? input.fileKey : '',
    nodeId: /^\d+:\d+$/.test(input.nodeId || '') ? input.nodeId : '',
  };
}

async function allFiles() {
  const blobs = [];
  let cursor;
  do {
    const r = await list({ prefix: 'sections/', cursor, limit: 1000 });
    blobs.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function readAll() {
  const files = await allFiles();
  const docs = await Promise.all(files.map(async (b) => {
    try {
      const r = await fetch(b.url, { cache: 'no-store' });
      if (!r.ok) return null;
      return { ...(await r.json()), _url: b.url };
    } catch { return null; }
  }));
  const byId = new Map();
  for (const d of docs) {
    if (!d || !d.id) continue;
    const prev = byId.get(d.id);
    if (!prev || (d.updatedAt || 0) > (prev.updatedAt || 0)) byId.set(d.id, d);
  }
  return [...byId.values()];
}

async function writeDoc(doc) {
  const { _url, ...data } = doc;
  const r = await put(`sections/${doc.id}.json`, JSON.stringify(data), {
    access: 'public', addRandomSuffix: true, contentType: 'application/json', cacheControlMaxAge: 60,
  });
  return { ...data, _url: r.url };
}

const noStore = () => Response.json({ error: 'Storage isn’t connected yet. In Vercel: Storage → Create → Blob → Connect, then redeploy.' }, { status: 503 });
const strip = ({ _url, ...d }) => d;
const validId = (id) => /^[a-f0-9]{16}$/.test(id || '');
const ownFile = (id) => (b) => new RegExp(`^sections/${id}[-.]`).test(b.pathname);

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return noStore();
  const docs = await readAll();
  docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return Response.json(docs.map(strip), { headers: { 'cache-control': 'no-store' } });
}

export async function POST(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return noStore();
  const body = await request.json();
  if (!isBlobUrl(body.thumb) || !isBlobUrl(body.payload)) return Response.json({ error: 'Missing preview or Figma layers.' }, { status: 400 });
  const now = Date.now();
  const doc = {
    id: (crypto.randomUUID().replace(/-/g, '')).slice(0, 16),
    ...clean(body),
    thumb: body.thumb,
    payload: body.payload,
    payloadSize: Number(body.payloadSize) || 0,
    createdAt: now,
    updatedAt: now,
  };
  return Response.json(strip(await writeDoc(doc)));
}

export async function PUT(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return noStore();
  const id = new URL(request.url).searchParams.get('id');
  if (!validId(id)) return Response.json({ error: 'Bad id.' }, { status: 400 });
  const body = await request.json();
  const docs = (await allFiles()).filter(ownFile(id));
  const current = (await readAll()).find((d) => d.id === id);
  if (!current) return Response.json({ error: 'That section no longer exists.' }, { status: 404 });
  const next = { ...current, ...clean(body), updatedAt: Date.now() };
  let oldThumb = null;
  if (body.thumb && body.thumb !== current.thumb) {
    if (!isBlobUrl(body.thumb)) return Response.json({ error: 'Bad preview URL.' }, { status: 400 });
    oldThumb = current.thumb;
    next.thumb = body.thumb;
  }
  const saved = await writeDoc(next);
  const stale = docs.map((b) => b.url).filter((u) => u !== saved._url);
  if (oldThumb) stale.push(oldThumb);
  if (stale.length) await del(stale);
  return Response.json(strip(saved));
}

export async function DELETE(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return noStore();
  const id = new URL(request.url).searchParams.get('id');
  if (!validId(id)) return Response.json({ error: 'Bad id.' }, { status: 400 });
  const current = (await readAll()).find((d) => d.id === id);
  const files = (await allFiles()).filter(ownFile(id)).map((b) => b.url);
  if (current) files.push(current.thumb, current.payload);
  const urls = files.filter(isBlobUrl);
  if (urls.length) await del(urls);
  return Response.json({ ok: true });
}
