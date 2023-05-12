import supertest from 'supertest'
import { server } from '../../../index'
import {
    query as createUserQuery,
    variable as createUserVariable,
} from '../../user/mutation/createUser.spec'
import { query as loginQuery, variable as loginVariable } from './login.spec'
import { query as meQuery } from '../query/me.spec'
import Service from '@/utils/service'
import { IUser } from '@/components/user/user'

const query = /* GraphQL */ `
    mutation Logout {
        logout
    }
`

describe('me query', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        const users_service = new Service<IUser>('users')
        users_service.deleteAll()

        await request.post('/graphql').trustLocalhost().send({
            query: createUserQuery,
            variables: createUserVariable,
        })
    })

    afterAll(() => server.close())

    it('user unauthorised', async () => {
        await request.post('/graphql').trustLocalhost().send({
            query: loginQuery,
            variables: loginVariable,
        })

        let response = await request.post('/graphql').trustLocalhost().send({
            query: meQuery,
        })

        let data = response.body.data.me
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

        response = await request.post('/graphql').trustLocalhost().send({
            query,
        })

        data = response.body.data.logout
        expect(data).toBe(true)

        response = await request.post('/graphql').trustLocalhost().send({
            query: meQuery,
        })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('UNAUTHORIZED')
        expect(errors[0].field).toBe('user')
        expect(response.body.data).toBeNull()
    })
})
