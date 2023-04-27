import express from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import https from 'https'
import fs from 'fs'
import cors from 'cors'
import { graphqlServer } from './graphql'

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

graphqlServer(server).then((apolloServer) => {
    app.use('/graphql', expressMiddleware(apolloServer))
})

server.listen({ port: 4000 })
