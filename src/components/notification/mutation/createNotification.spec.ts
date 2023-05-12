import supertest from 'supertest'
import { server } from '@/index'
import Service from '@/utils/service'
import { INotification } from '@/components/notification/notification'
import {
    variable as user_variable,
    query as user_query,
} from '@/components/user/mutation/createUser.spec'
import {
    variable as component_variable,
    query as component_query,
} from '@/components/component/mutation/createComponent.spec'
import { IComponent } from '@/components/component/component'
import { IUser } from '@/components/user/user'

export const query = /* GraphQL */ `
    mutation Mutation(
        $user: ID!
        $component: String!
        $type: NotificationType!
        $title: String!
        $message: String!
        $contentType: ContentType
    ) {
        createNotification(
            user: $user
            component: $component
            type: $type
            title: $title
            message: $message
            contentType: $contentType
        ) {
            _id
            user {
                _id
                firstName
                lastName
                email
                terms
                createdAt
                updatedAt
                lastLogin
                active
            }
            component {
                _id
                name
                slug
                createdAt
                updatedAt
            }
            contentType
            type
            title
            message
            createdAt
        }
    }
`

describe('create notification mutation', () => {
    const request = supertest.agent(server)

    const variable = {
        user: '',
        component: '',
        type: 'mail',
        title: 'Forgot my password',
        message: 'Forgot my password message',
        contentType: 'html',
    }

    beforeAll(async () => {
        await new Service<INotification>('notifications').deleteAll()
        await new Service<IComponent>('components').deleteAll()
        await new Service<IUser>('users').deleteAll()

        const user = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: user_query,
                variables: {
                    ...user_variable,
                },
            })
        variable.user = user.body.data.createUser._id.toString()

        const component = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: component_query,
                variables: {
                    ...component_variable,
                },
            })
        variable.component = component.body.data.createComponent._id.toString()
    })

    afterAll(() => server.close())

    it('empty user', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    user: '',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('user')
    })

    it('invalid user', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    user: 'invalid',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('OBJECT_ID_INVALID')
        expect(errors[0].field).toBe('user')
    })

    it('empty component', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    component: '',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('component')
    })

    it('invalid component', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    component: 'invalid',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('OBJECT_ID_INVALID')
        expect(errors[0].field).toBe('component')
    })

    it('empty title', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    title: '',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('title')
    })

    it('invalid title', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    title: 'aghdafs#$%^&*',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('ALPHA_WITH_SPACES_AND_NUMBERS_INVALID')
        expect(errors[0].field).toBe('title')
    })

    it('valid notification', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                },
            })

        const notification = response.body.data.createNotification
        expect(notification).toHaveProperty('_id')
        expect(notification).toHaveProperty('user')
        expect(notification).toHaveProperty('component')
        expect(notification).toHaveProperty('contentType')
        expect(notification).toHaveProperty('type')
        expect(notification).toHaveProperty('title')
        expect(notification).toHaveProperty('message')
        expect(notification).toHaveProperty('createdAt')
    })
})
