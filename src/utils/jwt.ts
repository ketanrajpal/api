import jwt, { Secret } from 'jsonwebtoken'
import { IUser } from '../components/user/user'
import { WithId } from 'mongodb'

/** payload interface */
export interface IPayload {
    _id: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
    lastLogin: string
}

/** csrf payload interface */
export interface ICsrfPayload {
    request_url: string
}

/** create access token */
export const create_access_token = (user: WithId<IUser>) => {
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET as Secret
    const access_token_expiration = process.env.ACCESS_TOKEN_EXPIRATION
    const issuer = process.env.ISSUER

    return jwt.sign(
        {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt.toString(),
            lastLogin: user.lastLogin,
        } as IPayload,
        access_token_secret,
        {
            expiresIn: access_token_expiration,
            subject: user._id.toString(),
            issuer,
        }
    )
}

/** create refresh token */
export const create_refresh_token = (user: WithId<IUser>) => {
    const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET as Secret
    const refresh_token_expiration = process.env.REFRESH_TOKEN_EXPIRATION
    const issuer = process.env.ISSUER

    return jwt.sign(
        {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt.toString(),
            lastLogin: user.lastLogin,
        } as IPayload,
        refresh_token_secret,
        {
            expiresIn: refresh_token_expiration,
            subject: user._id.toString(),
            issuer,
        }
    )
}

/** create csrf token */
export const create_csrf_token = (request_url: string) => {
    const csrf_token_secret = process.env.CSRF_TOKEN_SECRET as Secret
    const csrf_token_expiration = process.env.CSRF_TOKEN_EXPIRATION
    const issuer = process.env.ISSUER

    return jwt.sign(
        {
            request_url,
        } as ICsrfPayload,
        csrf_token_secret,
        {
            expiresIn: csrf_token_expiration,
            subject: 'csrf token',
            issuer,
        }
    )
}

/** verify access token */
export const verify_access_token = (token: string) => {
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET as Secret
    const issuer = process.env.ISSUER

    return jwt.verify(token, access_token_secret, {
        issuer,
    }) as IPayload
}

/** verify refresh token */
export const verify_refresh_token = (token: string) => {
    const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET as Secret
    const issuer = process.env.ISSUER

    return jwt.verify(token, refresh_token_secret, {
        issuer,
    }) as IPayload
}

/** verify csrf token */
export const verify_csrf_token = (token: string, request_url: string) => {
    const csrf_token_secret = process.env.CSRF_TOKEN_SECRET as Secret
    const issuer = process.env.ISSUER

    const verification = jwt.verify(token, csrf_token_secret, {
        issuer,
    }) as ICsrfPayload

    if (verification && verification.request_url === request_url) {
        return true
    }

    return false
}
