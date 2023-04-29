import { ApolloServer } from '@apollo/server'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import https from 'https'

import domainTypedefs from './components/domain/typedefs'
import domainResolvers from './components/domain/resolvers'

import userTypedefs from './components/user/typedefs'
import userResolvers from './components/user/resolvers'

/** graphql sever */
export const graphqlServer = async (server: https.Server) => {
    const schema = buildSubgraphSchema([
        { typeDefs: domainTypedefs, resolvers: domainResolvers },
        { typeDefs: userTypedefs, resolvers: userResolvers },
    ])

    const apolloServer = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
    })

    await apolloServer.start()

    return apolloServer
}
