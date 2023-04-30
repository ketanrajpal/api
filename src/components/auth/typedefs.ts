import { gql } from 'graphql-tag'

export default gql`
    type Login {
        user: User!
    }

    extend type Query {
        "get logged in user"
        me: User!
    }

    extend type Mutation {
        "login user"
        login(email: String!, password: String!): User!

        "logout user"
        logout: Boolean!
    }
`
