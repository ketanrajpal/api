import { create_secure_cookie } from '@/utils/cookie'
import { create_csrf_token } from '@/utils/jwt'
import { Request, Router, Response } from 'express'
import { create_url } from '@/utils/url'

const router = Router()

router.get('/', (request: Request, response: Response) => {
    create_secure_cookie(
        response,
        'csrf_token',
        create_csrf_token(create_url(request))
    )
    response.status(200).json({ message: 'csrf token created' })
})

export default router
