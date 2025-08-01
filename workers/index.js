import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

let privatePages = null

// Lazy-load and cache private-pages.json from static site
async function loadPrivatePages() {
  if (!privatePages) {
    // IMPORTANT: Replace with your correct deployed domain!
    const response = await fetch("https://your-site.workers.dev/private-pages.json", {
      headers: { 'Cache-Control': 'no-cache' }
    })
    if (response.ok) {
      privatePages = await response.json()
    } else {
      console.warn("Failed to load private-pages.json")
      privatePages = []
    }
  }
  return privatePages
}

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  const request = event.request
  const url = new URL(request.url)

  // Normalize path
  let pathname = url.pathname
  if (pathname.endsWith("/")) pathname += "index.html"

  // Load private path list
  const privateList = await loadPrivatePages()
  const isPrivate = privateList.includes(pathname)

  if (isPrivate) {
    const jwt = request.headers.get("Cf-Access-Jwt-Assertion")
    if (!jwt) {
      return new Response(
        `<!DOCTYPE html><html lang="en">
          <head><meta charset="UTF-8"><title>Access Denied</title></head>
          <body style="font-family: sans-serif; padding: 2em;">
            <h1>🔒 Private Page</h1>
            <p>This page is protected by <strong>Cloudflare Access</strong>.</p>
            <p><a href="/">← Go back home</a></p>
          </body>
        </html>`,
        {
          status: 403,
          headers: { "Content-Type": "text/html" }
        }
      )
    }

    // Optionally validate the JWT further here
  }

  try {
    return await getAssetFromKV(event)
  } catch (e) {
    return new Response('Not found', { status: 404 })
  }
}
