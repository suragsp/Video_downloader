# CloudVideo — TeraBox Link Viewer (GitHub Pages starter)

A static website that accepts TeraBox share links and direct video URLs.

## Deploy on GitHub Pages
1. Create a new public GitHub repository, e.g. `cloudvideo`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for the Pages URL to appear.

## What works
- Direct video file URLs ending in `.mp4`, `.webm`, `.ogg`, `.ogv`, `.mov`, or `.m4v` can be loaded in the built-in player.
- A download link is offered for direct video URLs.
- TeraBox share links are recognized and can be opened on the original TeraBox site.
- Responsive interface, clipboard button, clear button, and basic URL validation.

## Important limitation
A TeraBox share URL is usually a web page, not a direct media URL. GitHub Pages is static hosting and cannot extract a playable/download URL from TeraBox by itself. TeraBox may block iframe embedding, require sign-in, or use temporary/protected media URLs. This starter does not bypass those restrictions. For reliable inline playback of TeraBox share links, a separately hosted backend using an authorized, permitted integration would be needed; never expose private account cookies or API credentials in front-end code.

Only access/download content you own or have permission to use.
