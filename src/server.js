import http from 'node:http'

import { parseRequestAndResponseBodyToJson } from './middlewares/parseRequestAndResponseBodyToJson.js'

import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const PORT = process.env.PORT || 3334;

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await parseRequestAndResponseBodyToJson(req, res)

  const route = routes.find(route => route.method === method && route.path.test(url))

  if (!route) {
    return res
    .writeHead(404, { 'Content-Type': 'text/plain'})
    .end('Bem vindo à Terra! 🌎\nVocê não pode acessar uma rota inexistente, ET! 🛸')
  }

  const routeParams = req.url.match(route.path)

  if (routeParams) {
    const { query, ...params } = routeParams.groups

    req.params = params || {}
    req.query = query ? extractQueryParams(query) : {}
  }

  return route.handler(req, res)

})

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT} 🚀`))
