module.exports = {
    serverRuntimeConfig: {
        secret: process.env.JWTSECRET
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development' ?
            'http://localhost:3000/api' // development api
            :
            'https://dyne-next.vercel.app/api' // production api
    }
}