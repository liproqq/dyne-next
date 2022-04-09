const expressJwt = require('express-jwt');
const util = require('util');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

const serverSidePropsEndpoints = ['/api/stats/standings', /^\/api\/roster\/.*/]

function jwtMiddleware(req, res) {
    const middleware = expressJwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/authenticate',
            ...serverSidePropsEndpoints
        ],
    });

    return util.promisify(middleware)(req, res);
}