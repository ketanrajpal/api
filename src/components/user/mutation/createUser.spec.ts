import { ApolloServer, GraphQLResponse } from '@apollo/server'
import { schema, error } from '../../../utils/graphql'

describe('create user mutation', () => {
    it('it should create user', async () => {
        const server = new ApolloServer({
            schema,
            formatError: error,
        })

        const response = await server.executeOperation({
            query: /* GraphQL */ `
                mutation createUser(
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
                    }
                }
            `,
            variables: {
                firstName: 'Ketan',
                lastName: 'Rajpal',
                email: 'ketanrajpal@gmail.com',
                password: 'Admin@123!',
                terms: true,
            },
        })

        expect(response.body.kind).toBe('single')
        expect(response.body).toHaveProperty('singleResult')

        server.stop()
    })
})
