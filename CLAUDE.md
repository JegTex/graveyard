# Graveyard by Prismatico

Internal tool for João and one colleague at Prismatico: a library of website sections (heroes, FAQs, footers…) that clients didn't pick, so they can be reused.

## How it works
- Bury: in Figma ⌘C a frame → ⌘V anywhere on the site (captures Figma clipboard HTML, which holds `(figmeta)` with fileKey + `selectedNodeData` node id, and the `(figma)` binary payload) → ⇧⌘C in Figma (copy as PNG) → ⌘V for the preview → pick tags → save.
- Reuse: "Copy" on a card (or ⌘C while hovering) writes the stored payload back as `text/html`; ⌘V in Figma gives editable layers.

## Stack
- Vite, plain JS frontend: `index.html`, `src/main.js`, `src/style.css`. BYQ-inspired dark UI, left sidebar.
- Vercel functions in `api/` (Web `Request`/`Response` handlers): `sections.js` (CRUD; one JSON per section in Blob), `file.js` (server-side uploads, ~4.4 MB limit), `payload.js` (fallback fetch), `login.js`.
- Storage: Vercel Blob (public store, OIDC via `BLOB_STORE_ID`). No database.
- `middleware.js` + `login.html`: shared passcode gate via `GRAVEYARD_PASSCODE` env var.
- Deploys automatically from `main` on GitHub (JegTex/graveyard) to Vercel (Hobby, free).

## Decisions (don't undo without asking João)
- No external APIs or paid services: no AI auto-tagging, no Figma API token, no automatic previews.
- Tags are manual: fixed section types, colours, and styles; new styles can be added in the bury form.
- Keep it free on Vercel Hobby.

## Working style
- João is a senior UI/UX designer. Be direct and concise. Ask before big or destructive changes. Don't add yourself as git co-author.
