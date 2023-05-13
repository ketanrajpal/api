import Service from '@/utils/service'
import { create_error, IError } from '../../../utils/error'
import {
    _object_id,
    _alpha_with_spaces_and_numbers,
    escape,
    _alpha,
} from '../../../utils/validator'
import { IUser } from '@/components/user/user'
import { IComponent } from '@/components/component/component'
import { INotification, INotificationInput } from '../notification'
import { ObjectId } from 'mongodb'

export default async (parent: undefined, args: INotificationInput) => {
    const error: IError[] = []

    const users_service = new Service<IUser>('users')
    const components_service = new Service<IComponent>('components')
    const notifications_service = new Service<INotification>('notifications')

    const user = _object_id(args.user, true)
    if (user.code !== null) create_error(error, 'user', user.code)
    else {
        const user_exist = await users_service.findById(
            new ObjectId(user.value)
        )
        if (!user_exist) create_error(error, 'user', 'USER_NOT_FOUND')
    }

    const component = _object_id(args.component, true)
    if (component.code !== null)
        create_error(error, 'component', component.code)
    else {
        const component_exist = await components_service.findById(
            new ObjectId(component.value)
        )
        if (!component_exist)
            create_error(error, 'component', 'COMPONENT_NOT_FOUND')
    }

    const contentType = _alpha(args.contentType, true)
    if (contentType.code !== null)
        create_error(error, 'contentType', contentType.code)
    else if (!['html', 'text'].includes(args.contentType))
        create_error(error, 'contentType', 'INVALID_CONTENT_TYPE')

    const type = _alpha(args.type, true)
    if (type.code !== null) create_error(error, 'type', type.code)
    else if (!['mail', 'sms', 'push'].includes(args.type))
        create_error(error, 'type', 'INVALID_NOTIFICATION_TYPE')

    const title = _alpha_with_spaces_and_numbers(args.title, true)
    if (title.code !== null) create_error(error, 'title', title.code)

    const message = escape(args.message)

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const notification: INotification = {
        user: new ObjectId(user.value),
        component: new ObjectId(component.value),
        contentType: args.contentType,
        type: args.type,
        title: title.value,
        message,
        createdAt: new Date(),
    }

    const result = await notifications_service.insertOne(notification)
    const created_notification = await notifications_service.findById(
        result.insertedId
    )
    return created_notification
}
