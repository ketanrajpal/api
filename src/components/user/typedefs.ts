import { gql } from 'graphql-tag'

export default gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        "get all users"
        users: [User!]!

        "get user by id"
        user(id: ID!): User!
    }

    extend type Mutation {
        "create new user"
        createUser(name: String!, email: String!, password: String!): User!
    }
`
