import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import https from 'https'
import fs from 'fs'
import cors from 'cors'

const application = async () => {
    const app = express()

    app.use(compression())
    app.use(helmet())
    app.disable('x-powered-by')
    app.use(cookieParser())
    app.use(cors())

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    const server = https.createServer(
        {
            key: fs.readFileSync(`${__dirname}/certs/localhost.key`),
            cert: fs.readFileSync(`${__dirname}/certs/localhost.crt`),
        },
        app
    )

    const books = [
        {
            title: 'The Awakening',
            author: 'Kate Chopin',
        },
        {
            title: 'City of Glass',
            author: 'Paul Auster',
        },
    ]

    const resolvers = {
        Query: {
            books: () => books,
        },
    }

    const apolloServer = new ApolloServer({
        typeDefs: `
        type Book {
            title: String
            author: String
          }

          type Query { 
            books: [Book]
          }
        `,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
    })

    await apolloServer.start()

    app.use('/graphql', expressMiddleware(apolloServer))

    server.listen({ port: 4000 })

    return server
}

application()
