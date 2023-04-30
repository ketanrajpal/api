import bcrypt from 'bcryptjs'

/** hash password to save in database */
export const hash_password = (password: string) => {
    const salt = bcrypt.genSaltSync(10)
    return { hash: bcrypt.hashSync(password, salt), salt }
}

/** compare password with hash */
export const compare_password = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
}
