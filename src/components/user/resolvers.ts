import createUser from './mutation/createUser'
import users from './query/users'

export default {
    Query: {
        users,
    },
    Mutation: {
        createUser,
    },
}
