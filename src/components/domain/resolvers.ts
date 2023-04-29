import { pubsub } from '../../graphql'

const domains = [
    {
        id: 1,
        name: 'example.com',
        createdAt: new Date(),
        createdBy: 1,
        updatedAt: new Date(),
    },
    {
        id: 2,
        name: 'example.org',
        createdAt: new Date(),
        createdBy: 2,
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
    Mutation: {
        createDomain: (parent: any, args: any) => {
            const domain = {
                id: domains.length + 1,
                name: args.name,
                createdAt: new Date(),
                createdBy: 1,
                updatedAt: new Date(),
            }
            domains.push(domain)
            pubsub.publish('domainCreated', { domainCreated: domain })
            return domain
        },
        updateDomain: (parent: any, args: any) => {
            const domain = domains.find((domain) => domain.id === args.id)
            if (!domain) {
                throw new Error('Domain not found')
            }
            domain.name = args.name
            domain.updatedAt = new Date()
            pubsub.publish('domainUpdated', { domainUpdated: domain })
            return domain
        },
    },
    Subscription: {
        domainCreated: {
            subscribe: () => pubsub.asyncIterator(['domainCreated']),
        },
        domainUpdated: {
            subscribe: () => pubsub.asyncIterator(['domainUpdated']),
        },
    },
    Domain: {
        createdBy: (parent: any) => {
            //return users.find((user) => user.id === parent.createdBy)
        },
    },
}
