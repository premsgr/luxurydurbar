export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'http://localhost:33001').replace(/\/$/, '')

  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return body
})
