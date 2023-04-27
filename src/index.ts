import express from 'express'
import compression from 'compression'
import helmet from 'helmet'

const app = express()

app.use(compression())
app.use(helmet())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})

export default app
