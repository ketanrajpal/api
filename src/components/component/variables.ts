export const createComponentMutation = {
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

export const updateComponentMutation = {
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

export const componentCreatedSubscription = {
    query: /* GraphQL */ `
        subscription Subscription {
            componentCreated {
                _id
                name
                slug
                createdAt
                updatedAt
            }
        }
    `,
}
