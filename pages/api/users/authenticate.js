const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
import executeQuery from 'lib/db';

import { apiHandler } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();


export default apiHandler(handler);

function handler(req, res) {
    switch (req.method) {
        case 'POST':
            return authenticate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    async function authenticate() {
        const { name, password } = req.body;
        const [gm] = await executeQuery({
            query: "SELECT name FROM gm WHERE name=? AND password=? LIMIT 1",
            values: [name, password]
        })
        if (!gm) throw 'Username or password is incorrect';


        // create a jwt token that is valid for 7 days
        const token = jwt.sign({ name: gm.name }, serverRuntimeConfig.secret, { expiresIn: '7d' });

        // return basic user details and token
        return res.status(200).json({
            name: gm.name,
            token
        });
    }
}
