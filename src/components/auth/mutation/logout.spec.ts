import supertest from 'supertest'
import { server } from '../../../index'
import Service from '@/utils/service'
import { IUser } from '@/components/user/user'
import { createUserMutation } from '@/components/user/variables'
import { loginMutation, logoutMutation, meQuery } from '../variables'

describe('logout mutation', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        await new Service<IUser>('users').deleteAll()

        await request.post('/graphql').trustLocalhost().send(createUserMutation)
    })

    afterAll(() => server.close())

    it('user unauthorised', async () => {
        await request.post('/graphql').trustLocalhost().send(loginMutation)

        let response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(meQuery)

        let data = response.body.data.me
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

        response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(logoutMutation)

        data = response.body.data.logout
        expect(data).toBe(true)

        response = await request.post('/graphql').trustLocalhost().send(meQuery)

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('UNAUTHORIZED')
        expect(errors[0].field).toBe('user')
        expect(response.body.data).toBeNull()
    })
})
