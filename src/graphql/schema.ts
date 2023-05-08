import { buildSubgraphSchema } from '@apollo/subgraph'

import typedefs from './typedefs'

import domainTypedefs from '../components/domain/typedefs'
import domainResolvers from '../components/domain/resolvers'

import componentTypedefs from '../components/component/typedefs'
import componentResolvers from '../components/component/resolvers'

import userTypedefs from '../components/user/typedefs'
import userResolvers from '../components/user/resolvers'

import authTypedefs from '../components/auth/typedefs'
import authResolvers from '../components/auth/resolvers'

import notifyTypedefs from '../components/notification/typedefs'
import notifyResolvers from '../components/notification/resolvers'

/** combine schema */
export default buildSubgraphSchema([
    { typeDefs: typedefs },
    { typeDefs: domainTypedefs, resolvers: domainResolvers },
    { typeDefs: componentTypedefs, resolvers: componentResolvers },
    { typeDefs: userTypedefs, resolvers: userResolvers },
    { typeDefs: authTypedefs, resolvers: authResolvers },
    { typeDefs: notifyTypedefs, resolvers: notifyResolvers },
])
