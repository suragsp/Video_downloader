# CloudVideo TeraBox Viewer starter

This is a frontend + Node backend starter. It is **not yet a functioning arbitrary-link resolver** until you configure a real, authorized TeraBox-compatible resolver service/API.

## Why this is necessary
GitHub Pages is static and cannot safely keep API keys or independently turn every TeraBox share page into a media stream. TeraBox's official integration docs describe authenticated share-streaming endpoints, which require authorized tokens and share/file metadata. There is no confirmed single public endpoint here that accepts every arbitrary share URL and returns a video.

## Resolver contract
Set `TERABOX_RESOLVER_URL` and `TERABOX_RESOLVER_API_KEY` in your backend host's private environment settings. The backend sends `POST` with `Authorization: Bearer <key>` and JSON `{"url":"https://teraboxshare.com/s/..."}`.

Expected response:
```json
{"title":"Shared files","files":[{"id":"1","name":"video.mp4","type":"video/mp4","size":1234,"url":"https://media.example/video.mp4","downloadUrl":"https://media.example/video.mp4"}]}
```
`url` must be an HTTPS media URL accessible by the browser. Temporary URLs need to be refreshed by the resolver. HLS (`.m3u8`) may require adding hls.js for browsers without native HLS.

## Run locally
1. Install Node.js 20+.
2. Extract this ZIP and open a terminal in the folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`, then add resolver settings.
5. Run `npm start` and open `http://localhost:3000`.

Without resolver settings, the page intentionally returns a clear configuration message.

## Deploy
The full app requires a Node-capable host (for example, a Node service host). Set environment variables privately there. GitHub Pages alone cannot run `server.js`; if you insist on Pages, host the backend separately and change `fetch("/api/resolve", ...)` in `public/app.js` to the backend URL and configure CORS.

Do not commit `.env`, API keys, access tokens, or cookies. Do not use this to bypass passwords, permissions, or access controls. `share.google` links can redirect to unrelated hosts; production code should safely resolve redirects and revalidate the final destination.
