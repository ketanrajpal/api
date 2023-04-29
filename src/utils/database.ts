import { MongoClient } from 'mongodb'

/** this function returns a connection to the database */
export const connection = async () => {
    const client = new MongoClient(`mongodb://localhost:27017`)
    await client.connect()
    const database = client.db(`necessity`)

    return { client, database }
}
