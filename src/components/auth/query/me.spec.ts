import supertest from 'supertest'
import { server } from '../../../index'
import {
    query as createUserQuery,
    variable as createUserVariable,
} from '../../user/mutation/createUser.spec'
import {
    query as loginQuery,
    variable as loginVariable,
} from '../mutation/login.spec'
import Service from '@/utils/service'
import { IUser } from '@/components/user/user'

export const query = /* GraphQL */ `
    query Query {
        me {
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

describe('logout mutation', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        await new Service<IUser>('users').deleteAll()

        await request.post('/graphql').trustLocalhost().send({
            query: createUserQuery,
            variables: createUserVariable,
        })
    })

    afterAll(() => server.close())

    it('user unauthorised', async () => {
        const response = await request.post('/graphql').trustLocalhost().send({
            query,
        })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('UNAUTHORIZED')
        expect(errors[0].field).toBe('user')
        expect(response.body.data).toBeNull()
    })

    it('me query ', async () => {
        await request.post('/graphql').trustLocalhost().send({
            query: loginQuery,
            variables: loginVariable,
        })

        const response = await request.post('/graphql').trustLocalhost().send({
            query,
        })

        const data = response.body.data.me
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
