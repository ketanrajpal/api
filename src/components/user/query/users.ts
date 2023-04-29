import { connection } from '../../../utils/database'

export default async () => {
    const { database, client } = await connection()
    const collection = database.collection('users', {})
    const result = await collection.find({}).toArray()
    client.close()
    return result
}
