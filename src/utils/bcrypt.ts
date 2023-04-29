import bycrpty from 'bcryptjs'

/** hash password to save in database */
export const hash_password = (password: string) => {
    const salt = bycrpty.genSaltSync(10)
    return { hash: bycrpty.hashSync(password, salt), salt }
}

/** compare password with hash */
export const compare_password = (password: string, hash: string) => {
    return bycrpty.compareSync(password, hash)
}
