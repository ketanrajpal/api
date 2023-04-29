export interface IError {
    code: string
    field: string
    message: string
}
export interface IErrorCodes {
    [key: string]: string
}

/** error codes */
const error_codes: IErrorCodes = {
    ALPHA_WITH_SPACES_INVALID: 'field {field} must contain only letters and spaces',
    EMAIL_ALREADY_EXIST: 'email address already exists',
    EMAIL_INVALID: 'email address is invalid',
    EMAIL_NOT_FOUND: 'email address not found',
    FIELD_REQUIRED: 'missing required field {field}',
    INVALID_AUTH: 'email address and password do not match',
    PASSWORD_INVALID:
        'password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number',
    TERMS_NOT_ACCEPTED: 'terms and conditions must be accepted',
    UNAUTHORIZED: 'you are not authorized to access this resource',
}

interface ICreateMessage {
    (code: string, field: string): string
}

/** create error message */
export const create_message: ICreateMessage = (code, field) => {
    try {
        return error_codes[code].replace('{field}', field.replace('_', ' '))
    } catch (error) {
        return `Unknown error in create message: ${code}`
    }
}

interface ICreateError {
    (error: IError[], field: string, code: string): void
}

/** create error object */
export const create_error: ICreateError = (error, field, code) => {
    error.push({
        code,
        field,
        message: create_message(code, field),
    })
}
