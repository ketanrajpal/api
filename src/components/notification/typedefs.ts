import { gql } from 'graphql-tag'

export default gql`
    enum NotificationType {
        mail
        sms
        push
    }

    type Notification {
        _id: ID!
        user: User!
        component: Component!
        contentType: ContentType
        type: NotificationType!
        title: String!
        message: String!
        createdAt: String!
    }

    enum NotificationOrderField {
        createdAt
    }

    input notificationOrder {
        field: NotificationOrderField!
        direction: SortOrder!
    }

    enum NotificationFilterField {
        title
        message
    }

    input notificationFilter {
        field: NotificationFilterField!
        value: String!
    }

    type NotificationEdge {
        cursor: String!
        node: Notification!
    }

    type notificationConnection {
        pageInfo: PageInfo!
        edges: [NotificationEdge!]!
    }

    extend type Query {
        "get all notifications"
        notifications(
            filter: [notificationFilter]
            order: [notificationOrder]
            pagination: pagination
        ): notificationConnection!
    }

    extend type Mutation {
        "create new notification"
        createNotification(
            user: ID!
            component: String!
            contentType: ContentType
            type: NotificationType!
            title: String!
            message: String!
        ): Notification!
    }
`
