import Service from '@/utils/service'
import {
    IComponent,
    IComponentUpdateInput,
} from '@/components/component/component'
import { _alpha_with_spaces, _object_id, _slug } from '@/utils/validator'
import { IError, create_error } from '@/utils/error'
import { ObjectId } from 'mongodb'
import { pubsub } from '@/graphql/subscription'

export default async (parent: undefined, args: IComponentUpdateInput) => {
    const error: IError[] = []
    const components_service = new Service<IComponent>('components')

    const _id = _object_id(args._id, true)
    if (_id.code !== null) create_error(error, '_id', _id.code)

    const name = _alpha_with_spaces(args.name, true)
    if (name.code !== null) create_error(error, 'name', name.code)

    const slug = _slug(name.value)
    const component_exist = await components_service.findMany({
        slug,
    })
    if (component_exist.length > 0) {
        const component_exist_with_id = component_exist.find(
            (component) => component._id.toString() !== args._id
        )
        if (component_exist_with_id)
            create_error(error, 'name', 'COMPONENT_ALREADY_EXIST')
    }

    if (error.length > 0) throw new Error(JSON.stringify(error))

    const component: IComponent = {
        name: args.name,
        slug,
        updatedAt: new Date(),
    }

    await components_service.updateById(new ObjectId(_id.value), component)
    const updated_component = await components_service.findById(
        new ObjectId(_id.value)
    )
    pubsub.publish('componentUpdated', { componentUpdated: updated_component })
    return updated_component
}
