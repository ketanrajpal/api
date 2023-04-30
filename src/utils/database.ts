import { MongoClient } from 'mongodb'

/** this function returns a connection to the database */
export const connection = async () => {
    const client = new MongoClient(process.env.MONGODB_URI as string)
    await client.connect()
    const database = client.db(process.env.DATABASE)

    return { client, database }
}
