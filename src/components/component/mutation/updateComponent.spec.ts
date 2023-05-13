import supertest from 'supertest'
import { server } from '@/index'
import Service from '@/utils/service'
import { IComponent } from '../component'
import {
    variable as create_component_variable,
    query as create_component_query,
} from '@/components/component/mutation/createComponent.spec'

export const query = /* GraphQL */ `
    mutation UpdateComponent($_id: ID!, $name: String!) {
        updateComponent(_id: $_id, name: $name) {
            _id
            name
            slug
            createdAt
            updatedAt
        }
    }
`

describe('update component mutation', () => {
    const request = supertest.agent(server)
    const variable = {
        _id: '',
        name: 'My Component',
    }

    beforeAll(async () => {
        await new Service<IComponent>('components').deleteAll()
        await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: create_component_query,
                variables: {
                    name: 'Auth',
                },
            })
        const component = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query: create_component_query,
                variables: {
                    ...create_component_variable,
                },
            })

        variable._id = component.body.data.createComponent._id.toString()
    })

    afterAll(() => server.close())

    it('empty name', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
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
                query,
                variables: {
                    ...variable,
                    name: 'invalid46578',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('ALPHA_WITH_SPACES_INVALID')
        expect(errors[0].field).toBe('name')
    })

    it('empty _id', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    _id: '',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('FIELD_REQUIRED')
        expect(errors[0].field).toBe('_id')
    })

    it('invalid _id', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    _id: 'invalid',
                },
            })
        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('OBJECT_ID_INVALID')
        expect(errors[0].field).toBe('_id')
    })

    it('valid component', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                },
            })

        const data = response.body.data.updateComponent
        expect(data).toHaveProperty('_id')
        expect(data).toHaveProperty('name', variable.name)
        expect(data).toHaveProperty('slug')
        expect(data).toHaveProperty('createdAt')
        expect(data).toHaveProperty('updatedAt')
        expect(response.body).not.toHaveProperty('errors')
    })

    it('component already exist', async () => {
        const response = await request
            .post('/graphql')
            .trustLocalhost()
            .send({
                query,
                variables: {
                    ...variable,
                    name: 'Auth',
                },
            })

        const errors = response.body.errors[0].message
        expect(errors).toBeInstanceOf(Array)
        expect(errors[0].code).toBe('COMPONENT_ALREADY_EXIST')
        expect(errors[0].field).toBe('name')
    })
})
