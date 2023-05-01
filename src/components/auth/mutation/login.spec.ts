import supertest from 'supertest'
import { server } from '../../../index'
import { connection } from '../../../utils/database'
import {
    query as createUserQuery,
    variable as createUserVariable,
} from '../../user/mutation/createUser.spec'

const query = /* GraphQL */ `
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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
    }
`

const variable = {
    email: 'john.doe@mail.com',
    password: 'Password@123!',
}

describe('login mutation', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        const { database, client } = await connection()
        const collection = database.collection('users', {})
        await collection.deleteMany({})
        client.close()

        await request.post('/graphql').trustLocalhost().send({
            query: createUserQuery,
            variables: createUserVariable,
        })
    })

    afterAll(() => {
        server.close()
    })

    it('empty email', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
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
                query,
                variables: {
                    ...variable,
                    email: 'john.doe@mail',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('EMAIL_INVALID')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })

    it(`email doesn't exist`, async () => {
        const response = await await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
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
                query,
                variables: {
                    ...variable,
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
                query,
                variables: {
                    ...variable,
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
                query,
                variables: {
                    ...variable,
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
        const response = await request.post('/graphql').trustLocalhost().send({
            query,
            variables: variable,
        })

        const cookies: string[] = []
        response
            .get('Set-Cookie')
            .forEach((cookie) => cookies.push(cookie.split('=')[0]))

        expect(cookies).toContain('accessToken')
        expect(cookies).toContain('refreshToken')

        const data = response.body.data.login
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty('firstName', createUserVariable.firstName)
        expect(data).toHaveProperty('lastName', createUserVariable.lastName)
        expect(data).toHaveProperty('email', createUserVariable.email)
        expect(data).toHaveProperty('terms', createUserVariable.terms)
        expect(data).toHaveProperty('createdAt')
        expect(data).toHaveProperty('updatedAt')
        expect(data).toHaveProperty('lastLogin')
        expect(data).toHaveProperty('active', true)
        expect(response.body).not.toHaveProperty('errors')
    })
})
