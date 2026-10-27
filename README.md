# Graveyard by Prismatico

A library of website sections clients didn't pick. Paste a Figma frame to bury it, find it later by type, colour, style or year, and copy it straight back into Figma.

No external APIs. Everything runs on Vercel's free plan with Vercel Blob for storage.

## Setup (about 10 minutes)

1. **Put the code on GitHub.** Create a new repo (e.g. `graveyard`) and push this folder to it.
2. **Import it in Vercel.** Vercel dashboard → Add New → Project → pick the repo. Leave the build settings as detected (Vite) and click **Deploy**. The first deploy will load but can't save yet. That's expected.
3. **Add storage.** In the new project: **Storage** tab → **Create** → **Blob** → name it `graveyard` → choose **Public** access if asked → **Connect** to the project for all environments. This adds `BLOB_READ_WRITE_TOKEN` automatically.
4. **Set the passcode.** Project → **Settings** → **Environment Variables** → add `GRAVEYARD_PASSCODE` with the passcode you and your colleague will use. (Leave it out and the site is open to anyone with the link.)
5. **Redeploy.** Deployments → latest → ⋯ → **Redeploy**. Environment changes only apply to new deploys.
6. Send your colleague the URL and the passcode. The passcode is remembered for a year per browser.

## Using it

**Bury a section**
1. In Figma, select the section frame and press **⌘C**.
2. On Graveyard, press **⌘V** anywhere. The Figma layers are captured.
3. Back in Figma, press **⇧⌘C** (copy as PNG) and **⌘V** again. That's the preview. A screenshot or a dropped image also works.
4. Pick the type, colours and styles (type a new style and press Enter to add it), fill in client and year, and click **Bury it**.

**Reuse a section**
- Hover a card and click **Copy**, or just press **⌘C** while hovering. Then **⌘V** on the Figma canvas.
- **Source** opens the original frame in Figma.
- Fonts used in the section must be installed on your machine.

## How it's built

- `index.html`, `src/` — the app (plain JS, built with Vite).
- `api/sections.js` — list, create, edit and delete sections. Each section is one JSON file in Blob storage.
- `api/upload.js` — lets the browser upload previews and Figma layers straight to Blob storage.
- `api/login.js`, `middleware.js`, `login.html` — the shared passcode gate.

Local development: `npm install`, then `vercel dev` (needs the Vercel CLI and `vercel link`, so the Blob token is available).

## Things to know

- Figma image fills inside stored layers point to Figma links that expire after about two weeks. Figma usually reloads them for anyone with access to the source file. If a reused section ever pastes with missing images, re-bury it from a file you keep.
- Vercel's Hobby plan is meant for non-commercial use. An internal tool for two people is usually fine in practice, but that's Vercel's rule, not ours.
