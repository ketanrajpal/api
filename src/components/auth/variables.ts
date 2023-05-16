export const loginMutation = {
    query: /* GraphQL */ `
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
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
        }
    `,
    variables: {
        email: 'john.doe@mail.com',
        password: 'Password@123!',
    },
}

export const logoutMutation = {
    query: /* GraphQL */ `
        mutation Logout {
            logout
        }
    `,
}

export const meQuery = {
    query: /* GraphQL */ `
        query Query {
            me {
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
        }
    `,
}
