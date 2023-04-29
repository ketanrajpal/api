const users = [
    {
        id: '1',
        name: 'Ketan',
        email: 'ketan@mail.com',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Kiansh',
        email: 'kiansh@mail.com',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

export default {
    Query: {
        users: () => users,
        user: (parent: any, args: any) => {
            return users.find((user) => user.id === args.id)
        },
    },
    Mutation: {
        createUser: (parent: any, args: any) => {
            const user = {
                id: String(users.length + 1),
                name: args.name,
                email: args.email,
                password: args.password,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            users.push(user)
            return user
        },
    },
}
