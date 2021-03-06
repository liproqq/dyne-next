const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
import executeQuery from 'lib/db';

import { apiHandler } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();


export default function random(req, res) {
  switch (req.method) {
    case 'POST':
      return register();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  async function register() {
    const { name, password, steam } = req.body;

    if (!name || !password || !steam) throw 'Missing required field';

    const dbRes = await executeQuery({ query: 'INSERT INTO gm(name, password, steam) VALUES (?,?,?)', values: [name, password, steam] })

    console.log(dbRes)
    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ name }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic user details and token
    return res.status(200).json({
      token
    });
  }
}
