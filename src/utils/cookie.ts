import { Response } from 'express'

/** create secure cookie */
export const create_secure_cookie = (
    response: Response,
    name: string,
    value: string
) => {
    response.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
}

/** delete secure cookie */
export const delete_secure_cookie = (response: Response, name: string) => {
    response.cookie(name, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
    })
}
