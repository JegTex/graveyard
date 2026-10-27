// Fallback for copying: fetches stored Figma layers server-side if the browser can't read them directly.
export async function GET(request) {
  const url = new URL(request.url).searchParams.get('url') || '';
  if (!/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/payloads\//i.test(url)) {
    return new Response('Bad URL', { status: 400 });
  }
  const r = await fetch(url);
  if (!r.ok) return new Response('Not found', { status: 404 });
  return new Response(await r.text(), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'private, max-age=86400' } });
}
