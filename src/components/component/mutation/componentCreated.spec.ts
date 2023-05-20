import supertest from 'supertest'
import { server } from '@/index'
import Service from '@/utils/service'
import { IComponent } from '../component'
import { componentCreatedSubscription } from '../variables'
import { createComponentMutation } from '../variables'
import { WebSocket } from 'ws'

describe('componentCreated subscription', () => {
    const request = supertest.agent(server)

    beforeAll(async () => {
        await new Service<IComponent>('components').deleteAll()
    })

    afterAll(() => server.close())

    it('should receive the componentCreated event when a component is created', async () => {
        const ws = new WebSocket(`ws://localhost:${process.env.PORT}/graphql`)

        // Subscribe to the componentCreated event
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'connection_init' }))
            ws.send(
                JSON.stringify({
                    id: '1',
                    type: 'start',
                    payload: {
                        query: componentCreatedSubscription.query,
                    },
                })
            )
        }

        request.post('/graphql').trustLocalhost().send(createComponentMutation)

        // Handle messages received from the WebSocket
        ws.onmessage = async (event) => {
            console.log(event)
        }
    })
})
