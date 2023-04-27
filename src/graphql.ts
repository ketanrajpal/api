import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import https from 'https'

export const graphqlServer = async (server: https.Server) => {
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

    const typeDefs =
        /* GraphQL */
        `
            type Book {
                title: String
                author: String
            }

            type Query {
                books: [Book]
            }
        `

    const resolvers = {
        Query: {
            books: () => books,
        },
    }

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
    })

    await apolloServer.start()

    return apolloServer
}
