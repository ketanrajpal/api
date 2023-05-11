import { IContext } from '../../../graphql/context'
import { create_error, IError } from '../../../utils/error'
import { IUser } from '../../user/user'
import { ObjectId } from 'mongodb'
import Service from '@/utils/service'

export default async (
    parent: undefined,
    args: undefined,
    context: IContext
) => {
    const error: IError[] = []
    if (context.user) {
        const users_service = new Service<IUser>('users')
        const user = await users_service.findById(
            new ObjectId(context.user._id)
        )
        return user
    } else {
        create_error(error, 'user', 'UNAUTHORIZED')
        throw new Error(JSON.stringify(error))
    }
}
