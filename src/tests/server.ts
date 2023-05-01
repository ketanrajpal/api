import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import schema from '../graphql/schema'
import error from '../graphql/error'
import dotenv from 'dotenv'
import { connection } from '../utils/database'

export default async () => {
    dotenv.config({ path: '.env.test' })

    const server: ApolloServer = new ApolloServer({
        schema,
        formatError: error,
    })

    const { url } = await startStandaloneServer(server, {
        listen: { port: 0 },
    })

    const { database, client } = await connection()
    const collection = database.collection('users', {})
    await collection.deleteMany({})
    client.close()

    return { url, server }
}
