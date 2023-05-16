export const createComponent = {
    query: /* GraphQL */ `
        mutation CreateComponent($name: String!) {
            createComponent(name: $name) {
                _id
                name
                slug
                createdAt
                updatedAt
            }
        }
    `,
    variables: {
        name: 'Component',
    },
}

export const updateComponent = {
    query: /* GraphQL */ `
        mutation UpdateComponent($_id: ID!, $name: String!) {
            updateComponent(_id: $_id, name: $name) {
                _id
                name
                slug
                createdAt
                updatedAt
            }
        }
    `,
}
