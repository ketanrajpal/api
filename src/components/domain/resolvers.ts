const domains = [
    {
        id: '1',
        name: 'example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'example.org',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

export default {
    Query: {
        domains: () => domains,
        domain: (parent: any, args: any) => {
            return domains.find((domain) => domain.id === args.id)
        },
    },
}
