import supertest from 'supertest'
import { server } from '../../../index'
import { connection } from '../../../utils/database'
import { createUserMutation } from '../variables'

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
        await request.get('/csrf').trustLocalhost().send()
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
                query: createUserMutation.query,
                variables: {
                    ...createUserMutation.variables,
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
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(createUserMutation)

        const data = response.body.data.createUser
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

    it('duplicate user email', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(createUserMutation)

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('EMAIL_ALREADY_EXIST')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })
})
