import {
    _alpha_with_spaces,
    _email,
    _password,
    _boolean,
} from '../../../utils/validator'
import { create_error, IError } from '../../../utils/error'
import { hash_password } from '../../../utils/bcrypt'

import Services from '@/utils/service'
import { IUser, IUserInput } from '../user'

export default async (parent: undefined, args: IUserInput) => {
    const users_service = new Services<IUser>('users')
    const error: IError[] = []

    const first_name = _alpha_with_spaces(args.firstName, true)
    if (first_name.code !== null)
        create_error(error, 'firstName', first_name.code)

    const last_name = _alpha_with_spaces(args.lastName, true)
    if (last_name.code !== null) create_error(error, 'lastName', last_name.code)

    const email = _email(args.email, true)
    if (email.code !== null) create_error(error, 'email', email.code)
    else {
        const user_exist = await users_service.findOne({ email: email.value })
        if (user_exist) create_error(error, 'email', 'EMAIL_ALREADY_EXIST')
    }

    const password = _password(args.password, true)
    if (password.code !== null) create_error(error, 'password', password.code)
    const { hash, salt } = hash_password(password.value)

    const terms = _boolean(args.terms.toString(), true)
    if (terms.code !== null) create_error(error, 'terms', terms.code)
    else if (!terms.value) create_error(error, 'terms', 'TERMS_NOT_ACCEPTED')

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const user: IUser = {
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        password: hash,
        salt,
        terms: args.terms,
        createdAt: new Date(),
        active: true,
    }

    try {
        const result = await users_service.insertOne(user)
        const created_user = await users_service.findById(result.insertedId)
        return created_user
    } catch (e) {
        create_error(error, 'email', 'UNKNOWN_ERROR')
        throw new Error(JSON.stringify(error))
    }
}
