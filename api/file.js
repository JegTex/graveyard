import { put } from '@vercel/blob';

// Stores a preview image or Figma layers. Goes through the server so it works with Vercel's
// automatic storage login (no tokens to manage). Vercel caps request bodies at about 4.5 MB.
const TYPES = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', txt: 'text/plain' };

export async function POST(request) {
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: 'Storage isn’t connected yet. In Vercel: Storage → Create → Blob → Connect, then redeploy.' }, { status: 503 });
  }
  const path = new URL(request.url).searchParams.get('path') || '';
  const m = path.match(/^(thumbs|payloads)\/[a-z0-9-]+\.(webp|jpg|png|txt)$/);
  if (!m) return Response.json({ error: 'Unexpected file path.' }, { status: 400 });
  const body = await request.arrayBuffer();
  if (!body.byteLength) return Response.json({ error: 'Empty file.' }, { status: 400 });
  try {
    const r = await put(path, body, { access: 'public', addRandomSuffix: true, contentType: TYPES[m[2]] });
    return Response.json({ url: r.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
