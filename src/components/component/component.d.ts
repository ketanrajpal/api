export interface IComponent {
    name: string
    slug: string
    createdAt: Date
    updatedAt?: Date
}

export interface IComponentInput {
    name: string
}
