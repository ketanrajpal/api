import { ObjectId } from 'mongodb'
import { connection } from '../../../utils/database'
import { create_error, IError } from '../../../utils/error'
import { _object_id } from '../../../utils/validator'

interface ICreateNotificationArgs {
    user: string
    component: 'user' | 'auth'
    contentType: 'html' | 'text'
    type: 'mail' | 'sms' | 'push'
    title: string
    message: string
}

export default async (parent: undefined, args: ICreateNotificationArgs) => {
    const error: IError[] = []

    const user = _object_id(args.user, true)
    if (user.code !== null) create_error(error, 'user', user.code)
    else {
        try {
            const { database, client } = await connection()
            const collection = database.collection('users', {})
            const user_exist = await collection.findOne({
                _id: new ObjectId(user.value),
            })
            client.close()
            if (!user_exist) create_error(error, 'user', 'USER_NOT_FOUND')
        } catch (e) {
            create_error(error, 'user', 'USER_NOT_FOUND')
        }
    }
}
