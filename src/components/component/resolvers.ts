import { pubsub } from '@/graphql/subscription'
import createComponent from './mutation/createComponent'
import updateComponent from './mutation/updateComponent'

import components from './query/components'

export default {
    Query: {
        components,
    },
    Mutation: {
        createComponent,
        updateComponent,
    },
    Subscription: {
        componentCreated: {
            subscribe: () => pubsub.asyncIterator(['componentCreated']),
        },
        componentUpdated: {
            subscribe: () => pubsub.asyncIterator(['componentUpdated']),
        },
    },
}
