import { apiHandler } from 'helpers/api';
import {
  getRosterByTeamAndSeason
} from 'lib/queries';

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getRoster();
    default:
      return res.status(500).end(`Internal Error in api/roster/`)
  }

  async function getRoster() {
    const [team, season] = req.query.params
    const roster = await getRosterByTeamAndSeason(team, season);
    return res.status(200).json(roster)
  }
}


