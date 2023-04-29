import { gql } from 'graphql-tag'

export default gql`
    type Domain {
        id: ID!
        name: String!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        "get all domains"
        domains: [Domain!]!

        "get a domain by id"
        domain(id: ID!): Domain
    }
`
