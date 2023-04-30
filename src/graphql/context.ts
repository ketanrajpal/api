import { Request, Response } from 'express'
import { verify_access_token } from '../utils/jwt'
import { connection } from '../utils/database'
import { ObjectId } from 'mongodb'
import { IUser } from '../components/user/user'

export interface IContext {
    request: Request
    response: Response
    user: IUser | null
}

export default async ({ req, res }: { req: Request; res: Response }) => {
    let user: IUser | null = null

    if ('accessToken' in req.cookies) {
        const payload = verify_access_token(req.cookies.accessToken)
        if (payload) {
            const { database, client } = await connection()
            const collection = database.collection('users', {})
            user = await collection.findOne<IUser>({
                _id: new ObjectId(payload._id),
                email: payload.email,
                createdAt: new Date(payload.createdAt),
            })
            client.close()
        } else user = null
    }

    return { request: req, response: res, user }
}
