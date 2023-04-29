import { gql } from 'graphql-tag'

export default gql`
    type Domain {
        id: ID!
        name: String!
        createdAt: String!
        createdBy: User!
        updatedAt: String!
    }

    type Query {
        "get all domains"
        domains: [Domain!]!

        "get a domain by id"
        domain(id: ID!): Domain
    }

    type Mutation {
        "create new domain"
        createDomain(name: String!): Domain!

        "update a domain by id"
        updateDomain(id: ID!, name: String!): Domain!
    }

    type Subscription {
        "subscribe to domain creation"
        domainCreated: Domain!

        "subscribe to domain update"
        domainUpdated: Domain!
    }
`
