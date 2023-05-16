import { Request } from 'express'

/** create url */
export const create_url = (request: Request) => {
    return `${request.protocol}://${request.get('host')}${
        request.originalUrl
    }` as string
}
