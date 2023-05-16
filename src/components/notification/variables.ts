export const createNotification = {
    query: /* GraphQL */ `
        mutation Mutation(
            $user: ID!
            $component: String!
            $type: NotificationType!
            $title: String!
            $message: String!
            $contentType: ContentType
        ) {
            createNotification(
                user: $user
                component: $component
                type: $type
                title: $title
                message: $message
                contentType: $contentType
            ) {
                _id
                user {
                    _id
                    firstName
                    lastName
                    email
                    terms
                    createdAt
                    updatedAt
                    lastLogin
                    active
                }
                component {
                    _id
                    name
                    slug
                    createdAt
                    updatedAt
                }
                contentType
                type
                title
                message
                createdAt
            }
        }
    `,
}
