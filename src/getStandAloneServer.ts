import { getApolloServer } from './../lib/index'
import express from 'express'
import http from 'spdy'

export default async function getStandAloneServer(
  dbConfig: any,
  gsgParams: any = {},
  customMutations: any = {},
  getMetadataFromContext: any,
  apolloServerOptions: any = {}
) {
  const app = express()
  const server = await getApolloServer({
    dbConfig,
    gsgParams,
    customMutations,
    getMetadataFromContext,
    apolloServerOptions,
  })

  server.applyMiddleware({
    app,
    path: '/graphql',
  })

  const port = process.env.PORT || 8080
  return new Promise((resolve, reject) => {
    const serverHttp = http
      .createServer(
        {
          spdy: {
            plain: true,
          },
        },
        app
      )
      .listen(port, async () => {
        console.log(
          `🚀 http/https/h2 server runs on  http://localhost:${port}/graphql .`
        )
        resolve(serverHttp)
      })
    server.installSubscriptionHandlers(serverHttp)
  })
}
