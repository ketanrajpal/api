import jwt, { Secret } from 'jsonwebtoken'
import { IUser } from '../components/user/user'

/** payload interface */
export interface IPayload {
    _id: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
    lastLogin: string
}

/** create access token */
export const create_access_token = (user: IUser) => {
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET as Secret
    const access_token_expiration = process.env.ACCESS_TOKEN_EXPIRATION
    const issuer = process.env.ISSUER

    return jwt.sign(
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
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
export const create_refresh_token = (user: IUser) => {
    const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET as Secret
    const refresh_token_expiration = process.env.REFRESH_TOKEN_EXPIRATION
    const issuer = process.env.ISSUER

    return jwt.sign(
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
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
