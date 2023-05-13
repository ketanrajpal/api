import { gql } from 'graphql-tag'

export default gql`
    type Component {
        _id: ID!
        name: String!
        slug: String!
        createdAt: String!
        updatedAt: String
    }

    extend type Query {
        "get all components"
        components: [Component!]!

        "get component by id"
        component(_id: ID!): Component!
    }

    extend type Mutation {
        "create new component"
        createComponent(name: String!): Component!

        "update component by id"
        updateComponent(_id: ID!, name: String!): Component!

        "delete component by id"
        deleteComponent(_id: ID!): Component!
    }

    extend type Subscription {
        "subscribe to component created event"
        componentCreated: Component!
    }
`
