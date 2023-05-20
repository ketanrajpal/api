import supertest from 'supertest'
import { server } from '../../../index'
import Service from '@/utils/service'
import { IComponent } from '../component'
import { createComponentMutation } from '../variables'

describe('create component mutation', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        await new Service<IComponent>('components').deleteAll()
    })

    afterAll(() => server.close())

    it('empty name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createComponentMutation.query,
                variables: {
                    name: '',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('name')
    })

    it('invalid name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: createComponentMutation.query,
                variables: {
                    name: 'invalid46578',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('ALPHA_WITH_SPACES_INVALID')
        expect(errors[0].field).toBe('name')
    })

    it('valid name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(createComponentMutation)

        const data = response.body.data.createComponent
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty(
            'name',
            createComponentMutation.variables.name
        )
        expect(data).toHaveProperty('slug')
        expect(data).toHaveProperty('createdAt')
        expect(data).toHaveProperty('updatedAt')
        expect(response.body).not.toHaveProperty('errors')
    })

    it('duplicate name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send(createComponentMutation)

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('COMPONENT_ALREADY_EXIST')
        expect(errors[0].field).toBe('name')
    })
})
