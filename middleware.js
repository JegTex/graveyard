import { next } from '@vercel/functions';
import { isAuthed } from './lib/auth.js';

export const config = {
  // Everything except the login page, the login endpoint and the upload callback (which checks the cookie itself).
  matcher: ['/((?!login\\.html|api/login|api/upload|favicon\\.svg).*)'],
};

export default async function middleware(request) {
  if (await isAuthed(request)) return next();
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Enter the passcode first.' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }
  return Response.redirect(new URL('/login.html', request.url), 302);
}
