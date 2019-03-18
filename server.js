const express = require('express')
const next = require('next')
const helmet = require('helmet')
const LRUCache = require('lru-cache')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  length: function(n, key) {
    return n.toString().length + key.toString().length
  },
  max: 100 * 1000 * 1000, // 100MB cache soft limit
  maxAge: 1000 * 60 * 60, // 1hour
})

const port = process.env.PORT || 3000

app
  .prepare()
  .then(() => {
    const server = express()
    server
      .use(helmet())
      .use(
        helmet.contentSecurityPolicy({
          directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'https://www.google-analytics.com'],
            scriptSrc: ["'self'", 'https://www.google-analytics.com'],
            styleSrc: [
              "'self'",
              'https://fonts.googleapis.com',
              "'unsafe-inline'",
            ],
          },
        }),
      )
      .disable('x-powered-by')

    server.get('/provinces', (req, res) => {
      res.redirect('/')
    })

    server.get('/provinces/:p', (req, res) => {
      const actualPage = '/provinces'
      const queryParams = { province: req.params.p }
      renderAndCache(req, res, actualPage, queryParams)
    })

    server.get('/federal', (req, res) => {
      renderAndCache(req, res, '/federal')
    })

    server.get('/', (req, res) => {
      renderAndCache(req, res, '/')
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })

/*
 * Modify this if you need to into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
  return `${req.url}`
}

async function renderAndCache(req, res, pagePath, queryParams) {
  const key = getCacheKey(req)

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT')
    res.send(ssrCache.get(key))
    return
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams)

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html)
      return
    }

    // Let's cache this page
    ssrCache.set(key, html)

    res.setHeader('x-cache', 'MISS')
    res.send(html)
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams)
  }
}
