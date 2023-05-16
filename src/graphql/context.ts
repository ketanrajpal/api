import { Request, Response } from 'express'
import { verify_access_token } from '../utils/jwt'
import { ObjectId, WithId } from 'mongodb'
import { IUser } from '../components/user/user'
import Service from '@/utils/service'
//import { create_url } from '@/utils/url' verify_csrf_token
//import { IError, create_error } from '@/utils/error'

export interface IContext {
    request: Request
    response: Response
    user: WithId<IUser> | null
}

export default async ({ req, res }: { req: Request; res: Response }) => {
    //const error: IError[] = []
    /** 
    if (!('csrf_token' in req.cookies)) {
        create_error(error, 'csrf_token', 'CSRF_TOKEN_INVALID')
        throw new Error(JSON.stringify(error))
    }

    if (verify_csrf_token(req.cookies.csrf_token, create_url(req)) === false) {
        create_error(error, 'csrf_token', 'CSRF_TOKEN_INVALID')
        throw new Error(JSON.stringify(error))
    }
*/
    let user: WithId<IUser> | null = null

    if ('accessToken' in req.cookies) {
        let payload = null
        try {
            payload = verify_access_token(req.cookies.accessToken)
        } catch (e) {
            payload = null
        }

        if (payload) {
            const users_service = new Service<IUser>('users')
            user = await users_service.findById(new ObjectId(payload._id))
        }
    }

    return { request: req, response: res, user }
}
