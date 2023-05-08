import { connection } from '../../../utils/database'

export default async () => {
    const { database, client } = await connection()
    const collection = database.collection('components', {})
    const result = await collection.find({}).toArray()
    client.close()
    return result
}
