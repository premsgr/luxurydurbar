import { VENUES } from '@luxurydurbar/shared'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'http://localhost:33001').replace(/\/$/, '')

  const staticPaths = ['/', '/events', '/halls', '/packages', '/gallery', '/contact']
  const hallPaths = VENUES.map((v) => `/halls/${v.slug}`)
  const enPaths = [...staticPaths, ...hallPaths]
  const nePaths = enPaths.map((path) => (path === '/' ? '/ne' : `/ne${path}`))

  const urls = [...enPaths, ...nePaths]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return body
})
