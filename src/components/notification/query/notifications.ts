import { connection } from '../../../utils/database'

interface IArgs {
    filter?: [
        {
            field: 'title' | 'message'
            value: string
        }
    ]
    order?: [{ field: 'createdAt'; direction: 'ASC' | 'DESC' }]
    pagination?: { page: number; pageSize: number }
}

export default async (parent: undefined, args: IArgs) => {
    return true
}
