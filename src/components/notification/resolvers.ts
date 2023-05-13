import { ObjectId } from 'mongodb'
import { connection } from '../../utils/database'
import createNotification from './mutation/createNotification'
import notifications from './query/notifications'

export default {
    Query: {
        notifications,
    },
    Mutation: {
        createNotification,
    },
    Notification: {
        user: async ({ user }: { user: ObjectId }) => {
            const { database, client } = await connection()
            const collection = database.collection('users', {})
            const user_exist = await collection.findOne({ _id: user })
            client.close()
            return user_exist
        },
        component: async ({ component }: { component: ObjectId }) => {
            const { database, client } = await connection()
            const collection = database.collection('components', {})
            const component_exist = await collection.findOne({ _id: component })
            client.close()
            return component_exist
        },
    },
}
