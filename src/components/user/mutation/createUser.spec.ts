import apolloServer from '../../../tests/server'
import request from 'supertest'
import { ApolloServer } from '@apollo/server'

const query = /* GraphQL */ `
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

const variables = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@mail.com',
    password: 'Password@123!',
    terms: true,
}

describe('create user mutation', () => {
    let url: string, server: ApolloServer
    beforeAll(async () => {
        ;({ url, server } = await apolloServer())
    })
    afterAll(async () => {
        server.stop()
    })

    it('empty first name', async () => {
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
                    firstName: '',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('firstName')
    })

    it('invalid first name', async () => {
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url)
            .post('/')
            .send({
                query,
                variables: {
                    ...variables,
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
        const response = await request(url).post('/').send({
            query,
            variables,
        })

        const data = response.body.data.createUser
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty('firstName', variables.firstName)
        expect(data).toHaveProperty('lastName', variables.lastName)
        expect(data).toHaveProperty('email', variables.email)
        expect(data).toHaveProperty('terms', variables.terms)
        expect(data).toHaveProperty('createdAt')
        expect(data).toHaveProperty('updatedAt')
        expect(data).toHaveProperty('lastLogin')
        expect(data).toHaveProperty('active', true)
        expect(response.body).not.toHaveProperty('errors')
    })

    it('duplicate user email', async () => {
        const response = await request(url).post('/').send({
            query,
            variables,
        })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('EMAIL_ALREADY_EXIST')
        expect(errors[0].field).toBe('email')
        expect(response.body.data).toBeNull()
    })
})
