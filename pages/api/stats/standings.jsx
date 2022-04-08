import { sql2json } from 'lib/db';

import { apiHandler } from 'helpers/api';
import {
  getCurrentStandings
} from 'lib/queries';

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getStandings();
    default:
      return res.status(500).end(`Internal Error in api/stats/standings`)
  }

  async function getStandings() {
    const standings = await getCurrentStandings();
    return res.status(200).json(standings)
  }
}


