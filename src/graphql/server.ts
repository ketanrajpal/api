import { ApolloServer } from '@apollo/server'

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import { Server } from 'https'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import schema from './schema'
import error from './error'
import { IContext } from './context'

/** graphql sever */
export default async (server: Server) => {
    const wsSocket = new WebSocketServer({ server, path: '/graphql' })
    const serverCleanup = useServer({ schema }, wsSocket)
    const apolloServer = new ApolloServer<IContext>({
        schema,
        formatError: error,
        plugins: [
            ApolloServerPluginInlineTrace(),
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
