import { ObjectId } from 'mongodb'

export interface INotification {
    user: ObjectId
    component: ObjectId
    contentType: 'html' | 'text'
    type: 'mail' | 'sms' | 'push'
    title: string
    message: string
    createdAt: Date
}

export interface INotificationInput {
    user: string
    component: string
    contentType: 'html' | 'text'
    type: 'mail' | 'sms' | 'push'
    title: string
    message: string
}
