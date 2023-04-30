import login from './mutation/login'
import logout from './mutation/logout'

import me from './query/me'

export default {
    Query: {
        me,
    },
    Mutation: {
        login,
        logout,
    },
}
