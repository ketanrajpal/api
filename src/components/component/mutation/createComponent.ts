import { connection } from '../../../utils/database'
import { create_error, IError } from '../../../utils/error'
import { _alpha_with_spaces, _slug } from '../../../utils/validator'
interface ICreateComponentArgs {
    name: string
}

export default async (parent: undefined, args: ICreateComponentArgs) => {
    const error: IError[] = []

    const name = _alpha_with_spaces(args.name, true)
    if (name.code !== null) create_error(error, 'name', name.code)

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const slug = _slug(name.value)
    try {
        const { database, client } = await connection()
        const collection = database.collection('components', {})
        const component_exist = await collection.findOne({ slug })
        client.close()
        if (component_exist)
            create_error(error, 'name', 'COMPONENT_ALREADY_EXIST')
    } catch (e) {
        create_error(error, 'name', 'COMPONENT_ALREADY_EXIST')
    }

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const component = {
        name: args.name,
        slug,
        createdAt: new Date(),
    }

    try {
        const { database, client } = await connection()
        const collection = database.collection('components', {})
        const result = await collection.insertOne(component)
        const inserted_record = await collection.findOne({
            _id: result.insertedId,
        })
        client.close()
        return inserted_record
    } catch (e) {
        create_error(error, 'name', 'UNKNOWN_ERROR')
        throw new Error(JSON.stringify(error))
    }
}
