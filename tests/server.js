const path = require('path')
const { getApolloServer } = require('./../lib/index')
const express = require('express')
const http = require('spdy')
const { PubSub } = require('graphql-subscriptions')
const config = require('./sqliteTestConfig.js')
const { getMetadataFromContext } = require('./tools')
const app = express()

var dbConfig = require(path.join(__dirname, '/sqliteTestConfig.js')).test

async function startServer() {
  var options = {
    spdy: {
      plain: true,
    },
  }

  const pubSubInstance = new PubSub()

  const server = await getApolloServer({
    dbConfig,
    pubSubInstance,
    getMetadataFromContext,
    apolloServerOptions: {
      // THIS IS FOR TESTING PURPOSE, DO NOT DO THAT IN PRODUCTION
      context: ({ req }) => ({ userId: req.headers.userId }),
    },
  })

  /**
   * This is the test server.
   * Used to allow the access to the Graphql Playground at this address: http://localhost:8080/graphql.
   * Each time the server is starter, the database is reset.
   */
  server.applyMiddleware({
    app,
    path: '/graphql',
  })

  const port = process.env.PORT || 8080

  const serverHttp = http.createServer(options, app).listen(port, async () => {
    console.log(
      `🚀 http/https/h2 server runs on  http://localhost:${port}/graphql .`
    )
  })

  server.installSubscriptionHandlers(serverHttp)
}

startServer()
