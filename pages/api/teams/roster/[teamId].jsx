import { apiHandler } from 'helpers/api';
import { getCurrentRosterByTeamId } from 'pages/api/stats/game.jsx'


export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getCurrentTeamRoster();
    default:
      return res.status(200).end(`Internal Error`)
  }

  async function getCurrentTeamRoster() {
    const { teamId } = req.query
    const roster = await getCurrentRosterByTeamId(teamId)

    return res.status(200).json({ roster })
  }
}