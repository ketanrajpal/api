import supertest from 'supertest'
import { server } from '../../../index'

import Service from '@/utils/service'
import { IUser } from '@/components/user/user'
import { loginMutation } from '../variables'
import { createUserMutation } from '@/components/user/variables'

describe('login mutation', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        await new Service<IUser>('users').deleteAll()

        await request.post('/graphql').trustLocalhost().send(createUserMutation)
    })

    afterAll(() => server.close())

    it('empty email', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: loginMutation.query,
                variables: {
                    ...loginMutation.variables,
                    email: '',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })

    it('invalid email', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: loginMutation.query,
                variables: {
                    ...loginMutation.variables,
                    email: 'john.doe@mail',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('EMAIL_INVALID')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })

    it('email not exist', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: loginMutation.query,
                variables: {
                    ...loginMutation.variables,
                    email: 'noemail@account.com',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('EMAIL_NOT_FOUND')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })

    it('empty password', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: loginMutation.query,
                variables: {
                    ...loginMutation.variables,
                    password: '',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('password')
        expect(response.body.data).toBeNull()
    })

    it('invalid password', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: loginMutation.query,
                variables: {
                    ...loginMutation.variables,
                    password: 'password',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('PASSWORD_INVALID')
        expect(errors[0].field).toBe('password')
        expect(response.body.data).toBeNull()
    })

    it('wrong password', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: loginMutation.query,
                variables: {
                    ...loginMutation.variables,
                    password: 'Wrong@Password@123!',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('INVALID_AUTH')
        expect(errors[0].field).toBe('password')
        expect(response.body.data).toBeNull()
    })

    it('valid login', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(loginMutation)

        const cookies: string[] = []
        response
            .get('Set-Cookie')
            .forEach((cookie) => cookies.push(cookie.split('=')[0]))

        expect(cookies).toContain('accessToken')
        expect(cookies).toContain('refreshToken')

        const data = response.body.data.login
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty(
            'firstName',
            createUserMutation.variables.firstName
        )
        expect(data).toHaveProperty(
            'lastName',
            createUserMutation.variables.lastName
        )
        expect(data).toHaveProperty('email', createUserMutation.variables.email)
        expect(data).toHaveProperty('terms', createUserMutation.variables.terms)
        expect(data).toHaveProperty('createdAt')
        expect(data).toHaveProperty('updatedAt')
        expect(data).toHaveProperty('lastLogin')
        expect(data).toHaveProperty('active', true)
        expect(response.body).not.toHaveProperty('errors')
    })
})
