import validator from 'validator'

/** escape string validator */
export const escape = (string: string): string => {
    string = validator.trim(string)
    return validator.escape(string)
}

/** alpha validator */
export const _alpha = (
    string: string,
    required: boolean
): { code: string | null; value: string } => {
    let code: string | null = null
    string = escape(string)
    if (required && string.length === 0) code = 'FIELD_REQUIRED'
    if (string.length > 0 && !validator.isAlpha(string)) code = 'ALPHA_INVALID'
    return { code, value: string }
}

/** alpha with spaces validator */
export const _alpha_with_spaces = (
    string: string,
    required: boolean
): { code: string | null; value: string } => {
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

/** boolean validator */
export const _boolean = (
    string: string,
    required: boolean
): { code: string | null; value: boolean } => {
    let code: string | null = null
    string = escape(string)
    if (required && string.length === 0) code = 'FIELD_REQUIRED'
    if (string.length > 0 && !validator.isBoolean(string))
        code = 'BOOLEAN_INVALID'
    return { code, value: validator.toBoolean(string) }
}

/** email validator */
export const _email = (
    email: string,
    required: boolean
): { code: string | null; value: string } => {
    let code: string | null = null
    email = escape(email).toLowerCase()
    if (required && email.length === 0) code = 'FIELD_REQUIRED'
    if (email.length > 0 && !validator.isEmail(email)) code = 'EMAIL_INVALID'
    return { code, value: email }
}

/** password validator */
export const _password = (
    password: string,
    required: boolean
): {
    code: string | null
    value: string
} => {
    let code: string | null = null
    password = escape(password)
    if (required && password.length === 0) code = 'FIELD_REQUIRED'
    if (password.length > 0 && !validator.isStrongPassword(password))
        code = 'PASSWORD_INVALID'
    return { code, value: password }
}
