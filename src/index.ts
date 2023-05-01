import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { createServer } from 'https'
import fs from 'fs'
import cors from 'cors'
import graphqlServer from './graphql/server'
import context from './graphql/context'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()

app.use(compression())
app.use(helmet())
app.disable('x-powered-by')
app.use(cookieParser())
app.use(
    cors({
        origin: 'https://studio.apollographql.com',
        credentials: true,
    })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export const server = createServer(
    {
        key: fs.readFileSync(`${__dirname}/certs/localhost.key`),
        cert: fs.readFileSync(`${__dirname}/certs/localhost.crt`),
    },
    app
).listen({ port: process.env.PORT })

graphqlServer(server).then((apolloServer) => {
    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context,
        })
    )
})
