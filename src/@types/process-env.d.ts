declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test'
        PORT: string
        MONGODB_URI: string
        DATABASE: string
        SESSION_SECRET: string
        ACCESS_TOKEN_SECRET: string
        ACCESS_TOKEN_EXPIRATION: string
        REFRESH_TOKEN_SECRET: string
        REFRESH_TOKEN_EXPIRATION: string
        ISSUER: string
    }
}
