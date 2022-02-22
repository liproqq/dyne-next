import { apiHandler } from 'helpers/api';
import { getCurrentTeamIdByGmName } from 'pages/api/stats/game.jsx'

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getTeamIdByGm();
    default:
      return res.status(200).end(`Internal Error`)
  }

  async function getTeamIdByGm() {
    const { gm } = req.query

    const teamId = await getCurrentTeamIdByGmName(gm)

    return res.status(200).json({ teamId })
  }
}