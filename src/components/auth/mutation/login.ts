import { IContext } from '../../../graphql/server'

import { connection } from '../../../utils/database'
import { create_error, IError } from '../../../utils/error'
import { _email, _password } from '../../../utils/validator'
import { compare_password } from '../../../utils/bcrypt'
import { create_access_token, create_refresh_token } from '../../../utils/jwt'

import { create_secure_cookie } from '../../../utils/cookie'
import { IUser } from '../../user/typedefs'

interface ILoginArgs {
    email: string
    password: string
}

export default async (parent: any, args: ILoginArgs, context: IContext) => {
    const error: IError[] = []

    const email = _email(args.email, true)
    if (email.code !== null) create_error(error, 'email', email.code)

    const password = _password(args.password, true)
    if (password.code !== null) create_error(error, 'password', password.code)

    if (error.length > 0) throw error

    const { database, client } = await connection()
    const collection = database.collection('users', {})
    const user = await collection.findOne<IUser>({ email: email.value })
    client.close()

    if (!user) {
        create_error(error, 'email', 'EMAIL_NOT_FOUND')
        throw error
    } else {
        const password_match = compare_password(password.value, user.password)
        if (!password_match) {
            create_error(error, 'password', 'INVALID_AUTH')
            throw error
        } else {
            const access_token = create_access_token(user)
            const refresh_token = create_refresh_token(user)

            create_secure_cookie(context.response, 'accessToken', access_token)
            create_secure_cookie(
                context.response,
                'refreshToken',
                refresh_token
            )

            return user
        }
    }
}
