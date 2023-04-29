import { connection } from '../../../utils/database'
import {
    _alpha_with_spaces,
    _email,
    _password,
    _boolean,
} from '../../../utils/validator'
import { create_error, IError } from '../../../utils/error'
import { hash_password } from '../../../utils/bycrypt'

interface ICreateUserArgs {
    firstName: string
    lastName: string
    email: string
    password: string
    terms: boolean
}

export default async (parent: any, args: ICreateUserArgs) => {
    const error: IError[] = []

    const first_name = _alpha_with_spaces(args.firstName, true)
    if (first_name.code !== null)
        create_error(error, 'firstName', first_name.code)

    const last_name = _alpha_with_spaces(args.lastName, true)
    if (last_name.code !== null) create_error(error, 'lastName', last_name.code)

    const email = _email(args.email, true)
    if (email.code !== null) create_error(error, 'email', email.code)
    else {
        const { database, client } = await connection()
        const collection = database.collection('users', {})
        const user_exist = await collection.findOne({ email: email.value })
        client.close()
        if (user_exist) create_error(error, 'email', 'EMAIL_ALREADY_EXIST')
    }

    const password = _password(args.password, true)
    if (password.code !== null) create_error(error, 'password', password.code)
    const { hash, salt } = hash_password(password.value)

    const terms = _boolean(args.terms.toString(), true)
    if (terms.code !== null) create_error(error, 'terms', terms.code)
    else if (terms.value === false)
        create_error(error, 'terms', 'TERMS_NOT_ACCEPTED')

    if (error.length > 0) throw error

    const user = {
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        password: hash,
        salt,
        terms: args.terms,
        createdAt: new Date(),
        active: true,
    }

    const { database, client } = await connection()
    const collection = database.collection('users', {})
    const result = await collection.insertOne(user)
    const inserted_record = await collection.findOne(
        { _id: result.insertedId },
        { projection: { password: 0, salt: 0 } }
    )

    client.close()

    return inserted_record
}
