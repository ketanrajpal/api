import supertest from 'supertest'
import { server } from '@/index'
import Service from '@/utils/service'
import { INotification } from '@/components/notification/notification'
import { IComponent } from '@/components/component/component'
import { IUser } from '@/components/user/user'
import { createUserMutation } from '@/components/user/variables'
import { createComponentMutation } from '@/components/component/variables'
import { createNotificationMutation } from '../variables'

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
            .send(createUserMutation)
        variable.user = user.body.data.createUser._id.toString()

        const component = await request
            .post('/graphql')
            .trustLocalhost()
            .send(createComponentMutation)
        variable.component = component.body.data.createComponent._id.toString()
    })

    afterAll(async () => {
        await new Service<INotification>('notifications').deleteAll()
        await new Service<IComponent>('components').deleteAll()
        await new Service<IUser>('users').deleteAll()
        server.close()
    })

    test('empty user', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
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

    test('invalid user', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
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

    test('empty component', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
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

    test('invalid component', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
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

    test('empty title', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
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

    test('invalid title', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
                variables: {
                    ...variable,
                    title: '#invalid$%^title',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('ALPHA_WITH_SPACES_AND_NUMBERS_INVALID')
        expect(errors[0].field).toBe('title')
    })

    test('valid notification', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createNotificationMutation.query,
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
