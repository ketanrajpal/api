import {
    InsertOneResult,
    InsertManyResult,
    OptionalUnlessRequiredId,
    ObjectId,
    Filter,
    WithId,
    UpdateResult,
    Document,
    MatchKeysAndValues,
} from 'mongodb'
import { connection } from '@/utils/database'

type CollectionName = 'users' | 'components' | 'notifications'

/** database service class */
export default class Service<T extends Document> {
    protected collectionName: CollectionName

    constructor(collectionName: CollectionName) {
        this.collectionName = collectionName
    }

    /** insert one */
    async insertOne(
        data: OptionalUnlessRequiredId<T>
    ): Promise<InsertOneResult<T>> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        const result = await collection.insertOne(data)
        client.close()
        return result
    }

    /** insert many */
    async insertMany(
        data: OptionalUnlessRequiredId<T>[]
    ): Promise<InsertManyResult<T>> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        const result = await collection.insertMany(data)
        client.close()
        return result
    }

    /** update one */
    async updateById(
        _id: ObjectId,
        data: MatchKeysAndValues<T>
    ): Promise<UpdateResult<T>> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        const result = await collection.updateOne({ _id } as Filter<T>, {
            $set: data,
        })
        client.close()
        return result
    }

    /** find by id */
    async findById(_id: ObjectId): Promise<WithId<T> | null> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        const result = await collection.findOne({ _id } as Filter<T>)
        client.close()
        return result
    }

    /** find one */
    async findOne(filter: Filter<T>): Promise<WithId<T> | null> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        const result = await collection.findOne(filter)
        client.close()
        return result
    }

    /** find many */
    async findMany(filter: Filter<T>): Promise<WithId<T>[]> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        const result = await collection.find(filter).toArray()
        client.close()
        return result
    }

    /** delete all */
    async deleteAll(): Promise<void> {
        const { database, client } = await connection()
        const collection = database.collection<T>(this.collectionName)
        await collection.deleteMany({})
        client.close()
    }
}
