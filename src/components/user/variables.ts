export const createUserMutation = {
    query: /* GraphQL */ `
        mutation CreateUser(
            $firstName: String!
            $lastName: String!
            $email: String!
            $password: String!
            $terms: Boolean!
        ) {
            createUser(
                firstName: $firstName
                lastName: $lastName
                email: $email
                password: $password
                terms: $terms
            ) {
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
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        password: 'Password@123!',
        terms: true,
    },
}
