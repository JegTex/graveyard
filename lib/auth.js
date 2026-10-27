// Shared passcode gate. Set GRAVEYARD_PASSCODE in Vercel to turn it on; leave it empty to keep the site open.
export const COOKIE = 'gy_auth';

export async function passHash(pass) {
  const data = new TextEncoder().encode('graveyard:' + pass);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return '';
}

export async function isAuthed(request) {
  const pass = process.env.GRAVEYARD_PASSCODE;
  if (!pass) return true;
  return readCookie(request, COOKIE) === (await passHash(pass));
}
