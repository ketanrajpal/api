import { IUser } from '../user/user'

export interface INotification {
    _id: string
    user: IUser
    component: 'auth' | 'user'
    type: 'mail' | 'sms' | 'push'
    title: string
    message: string
    createdAt: string
}
