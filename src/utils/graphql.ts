import { ApolloServer } from '@apollo/server'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { Server } from 'https'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import domainTypedefs from '@/components/domain/typedefs'
import domainResolvers from '@/components/domain/resolvers'

import userTypedefs from '@/components/user/typedefs'
import userResolvers from '@/components/user/resolvers'

import { PubSub } from 'graphql-subscriptions'

/** graphql sever */
export const graphqlServer = async (server: Server) => {
    const schema = buildSubgraphSchema([
        { typeDefs: domainTypedefs, resolvers: domainResolvers },
        { typeDefs: userTypedefs, resolvers: userResolvers },
    ])

    const wsSocket = new WebSocketServer({ server, path: '/graphql' })

    const serverCleanup = useServer({ schema }, wsSocket)

    const apolloServer = new ApolloServer({
        schema,
        formatError: (error) => {
            const indexStart = error.message.indexOf('[')
            const indexEnd = error.message.indexOf(']')
            let message = error.message.substring(indexStart, indexEnd + 1)
            message = message.replace(/([a-zA-Z0-9]+?):/g, '"$1":')
            message = JSON.parse(message)
            return { ...error, message }
        },
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

/** graphql pubsub */
export const pubsub = new PubSub()
