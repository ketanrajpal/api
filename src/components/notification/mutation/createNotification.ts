import { connection } from '../../../utils/database'
import { create_error, IError } from '../../../utils/error'
import {
    _object_id,
    _alpha_with_spaces_and_numbers,
    escape,
} from '../../../utils/validator'

interface ICreateNotificationArgs {
    user: string
    component: string
    contentType: 'html' | 'text'
    type: 'mail' | 'sms' | 'push'
    title: string
    message: string
}

export default async (parent: undefined, args: ICreateNotificationArgs) => {
    const error: IError[] = []
    const { database, client } = await connection()

    const user = _object_id(args.user, true)
    if (user.code !== null) create_error(error, 'user', user.code)
    else {
        try {
            const collection = database.collection('users', {})
            const user_exist = await collection.findOne({
                _id: user.value,
            })
            if (!user_exist) create_error(error, 'user', 'USER_NOT_FOUND')
        } catch (e) {
            create_error(error, 'user', 'USER_NOT_FOUND')
        }
    }

    const component = _object_id(args.component, true)
    if (component.code !== null)
        create_error(error, 'component', component.code)
    else {
        try {
            const collection = database.collection('components', {})
            const component_exist = await collection.findOne({
                _id: component.value,
            })
            if (!component_exist)
                create_error(error, 'component', 'COMPONENT_NOT_FOUND')
        } catch (e) {
            create_error(error, 'component', 'COMPONENT_NOT_FOUND')
        }
    }

    client.close()

    if (args.contentType !== 'html' && args.contentType !== 'text')
        create_error(error, 'contentType', 'INVALID_CONTENT_TYPE')

    if (args.type !== 'mail' && args.type !== 'sms' && args.type !== 'push')
        create_error(error, 'type', 'INVALID_NOTIFICATION_TYPE')

    const title = _alpha_with_spaces_and_numbers(args.title, true)
    if (title.code !== null) create_error(error, 'title', title.code)

    const message = escape(args.message)

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const notification = {
        user: user.value,
        component: component.value,
        contentType: args.contentType,
        type: args.type,
        title: title.value,
        message: message,
        createdAt: new Date(),
    }

    try {
        const { database, client } = await connection()
        const collection = database.collection('notifications', {})
        const result = await collection.insertOne(notification)
        const inserted_record = await collection.findOne({
            _id: result.insertedId,
        })
        client.close()
        return inserted_record
    } catch (e) {
        create_error(error, 'notification', 'NOTIFICATION_NOT_CREATED')
        throw new Error(JSON.stringify(error))
    }
}
