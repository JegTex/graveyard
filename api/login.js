import { COOKIE, passHash } from '../lib/auth.js';

export async function POST(request) {
  const pass = process.env.GRAVEYARD_PASSCODE;
  let body = {};
  try { body = await request.json(); } catch {}
  if (!pass) return Response.json({ ok: true });
  if (typeof body.passcode !== 'string' || body.passcode !== pass) {
    return Response.json({ error: 'Wrong passcode.' }, { status: 401 });
  }
  const value = await passHash(pass);
  return Response.json({ ok: true }, {
    headers: { 'set-cookie': `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000` },
  });
}
