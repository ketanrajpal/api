import { GraphQLFormattedError } from 'graphql'

/** graphql custom error */
export default (error: GraphQLFormattedError) => {
    try {
        const indexStart = error.message.indexOf('[')
        const indexEnd = error.message.indexOf(']')
        let message = error.message.substring(indexStart, indexEnd + 1)
        message = message.replace(/([a-zA-Z0-9]+?):/g, '"$1":')
        message = JSON.parse(message)
        return { ...error, message }
    } catch (e) {
        return error
    }
}
