import { handleUpload } from '@vercel/blob/client';
import { isAuthed } from '../lib/auth.js';

// Issues short-lived tokens so the browser can upload previews and Figma layers straight to Blob storage.
export async function POST(request) {
  const body = await request.json();
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAuthed(request))) throw new Error('Enter the passcode first.');
        if (!/^(thumbs|payloads)\/[a-z0-9-]+\.(webp|jpg|png|txt)$/.test(pathname)) throw new Error('Unexpected file path.');
        return {
          allowedContentTypes: ['image/webp', 'image/jpeg', 'image/png', 'text/plain'],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
