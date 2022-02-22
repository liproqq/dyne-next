import executeQuery, { sql2json } from 'lib/db';

import { apiHandler } from 'helpers/api';

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getCurrentTeams();
    default:
      return res.status(200).end(`Internal Error in api/stats/game`)
  }

  async function getCurrentTeams() {
    const teams = await executeQuery({
      query:
        `SELECT team_id, name, short, code FROM team
        WHERE start<(SELECT season FROM season WHERE current=1) AND
              end>(SELECT season FROM season WHERE current=1) AND
              code NOT IN ("N/A","FA")
        ORDER BY short;`,
      values: []
    })

    return res.status(200).json({ teams })
  }
}
