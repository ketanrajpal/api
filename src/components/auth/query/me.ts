import { IContext } from '../../../graphql/context'
import { create_error, IError } from '../../../utils/error'

import { connection } from '../../../utils/database'
import { IUser } from '../../user/user'
import { ObjectId } from 'mongodb'

export default async (
    parent: undefined,
    args: undefined,
    context: IContext
) => {
    const error: IError[] = []
    if (context.user) {
        const { database, client } = await connection()
        const collection = database.collection('users', {})
        const user = await collection.findOne<IUser>({
            _id: new ObjectId(context.user._id),
        })
        client.close()
        return user
    } else {
        create_error(error, 'user', 'UNAUTHORIZED')
        throw error
    }
}
