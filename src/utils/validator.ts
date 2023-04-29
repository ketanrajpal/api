import validator from 'validator'

interface IEscape {
    (string: string): string
}

/** escape string validator */
export const escape: IEscape = (string) => {
    string = validator.trim(string)
    return validator.escape(string)
}

interface IAlpha {
    (string: string, required: boolean): { code: string | null; value: string }
}

/** alpha validator */
export const _alpha: IAlpha = (string, required) => {
    let code: string | null = null
    string = escape(string)
    if (required && string.length === 0) code = 'FIELD_REQUIRED'
    if (string.length > 0 && !validator.isAlpha(string)) code = 'ALPHA_INVALID'
    return { code, value: string }
}

interface IAlphaWithSpaces {
    (string: string, required: boolean): { code: string | null; value: string }
}

/** alpha with spaces validator */
export const _alpha_with_spaces: IAlphaWithSpaces = (string, required) => {
    let code: string | null = null
    string = escape(string)
    if (required && string.length === 0) code = 'FIELD_REQUIRED'
    if (
        string.length > 0 &&
        !validator.isAlpha(string, 'en-GB', { ignore: ' ' })
    )
        code = 'ALPHA_WITH_SPACES_INVALID'
    return { code, value: string }
}

interface IBoolean {
    (string: string, required: boolean): { code: string | null; value: boolean }
}

/** boolean validator */
export const _boolean: IBoolean = (string, required) => {
    let code: string | null = null
    string = escape(string)
    if (required && string.length === 0) code = 'FIELD_REQUIRED'
    if (string.length > 0 && !validator.isBoolean(string))
        code = 'BOOLEAN_INVALID'
    return { code, value: validator.toBoolean(string) }
}

interface IEmail {
    (email: string, required: boolean): { code: string | null; value: string }
}

/** email validator */
export const _email: IEmail = (email, required) => {
    let code: string | null = null
    email = escape(email).toLowerCase()
    if (required && email.length === 0) code = 'FIELD_REQUIRED'
    if (email.length > 0 && !validator.isEmail(email)) code = 'EMAIL_INVALID'
    return { code, value: email }
}

interface IPassword {
    (password: string, required: boolean): {
        code: string | null
        value: string
    }
}

/** password validator */
export const _password: IPassword = (password, required) => {
    let code: string | null = null
    password = escape(password)
    if (required && password.length === 0) code = 'FIELD_REQUIRED'
    if (password.length > 0 && !validator.isStrongPassword(password))
        code = 'PASSWORD_INVALID'
    return { code, value: password }
}
