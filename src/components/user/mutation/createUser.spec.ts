import supertest from 'supertest'
import { server } from '../../../index'
import { connection } from '../../../utils/database'

export const query = /* GraphQL */ `
    mutation CreateUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $terms: Boolean!
    ) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
            terms: $terms
        ) {
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

export const variable = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@mail.com',
    password: 'Password@123!',
    terms: true,
}

describe('create user mutation', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        const { database, client } = await connection()
        const collection = database.collection('users', {})
        await collection.deleteMany({})
        client.close()
    })

    afterAll(() => server.close())

    it('empty first name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    firstName: '',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('firstName')
    })

    it('invalid first name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    firstName: 'John123',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('ALPHA_WITH_SPACES_INVALID')
        expect(errors[0].field).toBe('firstName')
        expect(response.body.data).toBeNull()
    })

    it('empty last name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    lastName: '',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('lastName')
        expect(response.body.data).toBeNull()
    })

    it('invalid last name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    lastName: 'Doe123',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('ALPHA_WITH_SPACES_INVALID')
        expect(errors[0].field).toBe('lastName')
        expect(response.body.data).toBeNull()
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

    it('invalid terms', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    terms: false,
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('TERMS_NOT_ACCEPTED')
        expect(errors[0].field).toBe('terms')
        expect(response.body.data).toBeNull()
    })

    it('valid user', async () => {
        const response = await request.post('/graphql').trustLocalhost().send({
            query,
            variables: variable,
        })

        const data = response.body.data.createUser
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty('firstName', variable.firstName)
        expect(data).toHaveProperty('lastName', variable.lastName)
        expect(data).toHaveProperty('email', variable.email)
        expect(data).toHaveProperty('terms', variable.terms)
        expect(data).toHaveProperty('createdAt')
        expect(data).toHaveProperty('updatedAt')
        expect(data).toHaveProperty('lastLogin')
        expect(data).toHaveProperty('active', true)
        expect(response.body).not.toHaveProperty('errors')
    })

    it('duplicate user email', async () => {
        const response = await request.post('/graphql').trustLocalhost().send({
            query,
            variables: variable,
        })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('EMAIL_ALREADY_EXIST')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })
})
