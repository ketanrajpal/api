import createUser from '@/components/user/mutation/createUser'
import users from '@/components/user/query/users'

export default {
    Query: {
        users: users,
    },
    Mutation: {
        createUser: createUser,
    },
}
