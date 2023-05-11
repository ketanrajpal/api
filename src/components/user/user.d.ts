export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    salt: string
    terms: boolean
    createdAt: Date
    updatedAt?: string
    lastLogin?: string
    active: boolean
}

export interface IUserInput {
    firstName: string
    lastName: string
    email: string
    password: string
    terms: boolean
}
