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
        component(id: ID!): Component!
    }

    extend type Mutation {
        "create new component"
        createComponent(name: String!): Component!

        "update component by id"
        updateComponent(id: ID!, name: String!): Component!

        "delete component by id"
        deleteComponent(id: ID!): Component!
    }
`
