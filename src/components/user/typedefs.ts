import { gql } from 'graphql-tag'

export default gql`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        terms: Boolean!
        createdAt: String!
        updatedAt: String
        lastLogin: String
        active: Boolean!
    }

    extend type Query {
        "get all users"
        users: [User!]!

        "get user by id"
        user(id: ID!): User!
    }

    extend type Mutation {
        "create new user"
        createUser(
            firstName: String!
            lastName: String!
            email: String!
            password: String!
            terms: Boolean!
        ): User!
    }
`
