export interface IComponent {
    name: string
    slug: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IComponentCreateInput {
    name: string
}

export interface IComponentUpdateInput {
    _id: string
    name: string
}
