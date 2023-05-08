import { gql } from 'graphql-tag'

export default gql`
    "sort direction"
    enum SortOrder {
        ASC
        DESC
    }

    type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        startCursor: String
        endCursor: String
    }

    input pagination {
        page: Int!
        pageSize: Int!
    }

    enum ContentType {
        html
        text
    }
`
