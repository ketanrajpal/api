import { IContext } from '@/graphql/context'

export default (parent: undefined, args: undefined, context: IContext) => {
    context.response.clearCookie('accessToken')
    context.response.clearCookie('refreshToken')
    return true
}
