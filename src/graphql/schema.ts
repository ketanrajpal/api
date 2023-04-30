import { buildSubgraphSchema } from '@apollo/subgraph'

import domainTypedefs from '../components/domain/typedefs'
import domainResolvers from '../components/domain/resolvers'

import userTypedefs from '../components/user/typedefs'
import userResolvers from '../components/user/resolvers'

import authTypedefs from '../components/auth/typedefs'
import authResolvers from '../components/auth/resolvers'

/** combine schema */
export default buildSubgraphSchema([
    { typeDefs: domainTypedefs, resolvers: domainResolvers },
    { typeDefs: userTypedefs, resolvers: userResolvers },
    { typeDefs: authTypedefs, resolvers: authResolvers },
])
