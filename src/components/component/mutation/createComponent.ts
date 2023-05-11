import Service from '@/utils/service'
import { create_error, IError } from '../../../utils/error'
import { _alpha_with_spaces, _slug } from '../../../utils/validator'
interface ICreateComponentArgs {
    name: string
}

export default async (parent: undefined, args: ICreateComponentArgs) => {
    const error: IError[] = []
    const components_service = new Service('components')

    const name = _alpha_with_spaces(args.name, true)
    if (name.code !== null) create_error(error, 'name', name.code)

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const slug = _slug(name.value)
    const component_exist = await components_service.findOne({ slug })
    if (component_exist) {
        create_error(error, 'name', 'COMPONENT_ALREADY_EXIST')
    }

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const component = {
        name: args.name,
        slug,
        createdAt: new Date(),
    }

    const result = await components_service.insertOne(component)
    const created_component = await components_service.findById(
        result.insertedId
    )
    return created_component
}
