import { Request, Response } from 'express'
import { ApolloServer } from '@apollo/server'

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { Server } from 'https'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import schema from '../graphql/schema'
import error from '../graphql/error'
import { IUser } from '../components/user/typedefs'

export interface IContext {
    request: Request
    response: Response
    user: IUser | null
}

/** graphql sever */
export default async (server: Server) => {
    const wsSocket = new WebSocketServer({ server, path: '/graphql' })
    const serverCleanup = useServer({ schema }, wsSocket)
    const apolloServer = new ApolloServer<IContext>({
        schema,
        formatError: error,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer: server }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })

    await apolloServer.start()
    return apolloServer
}
