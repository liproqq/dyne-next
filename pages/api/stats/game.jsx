import { sql2json } from 'lib/db';

import { apiHandler } from 'helpers/api';
import {
  getCurrentTeamIdByGmName,
  getGameIdByTeamIds,
  createNewGameId,
  getCurrentRosterByTeamId,
  getGameStatsByPlayerAndGameId,
  getTeamGameStatsByTeamAndGameId
} from 'lib/queries';
import executeQuery from 'lib/db';

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getGameStats();
    case 'POST':
      return postGameStats();
    default:
      return res.status(200).end(`Internal Error in api/stats/game`)
  }

  async function getGameStats() {

    const { gmName, opponentTeamId } = req.body;
    const ownTeamId = await getCurrentTeamIdByGmName(gmName);

    let [gameId] = await getGameIdByTeamIds(ownTeamId, opponentTeamId)
    if (!gameId) {
      console.log("creating new gameid")
      gameId = createNewGameId(ownTeamId, opponentTeamId)
    } else {
      gameId = gameId.game_id
    }
    // players stats
    const ownRoster = await getCurrentRosterByTeamId(ownTeamId);
    const ownRosterStats = await Promise.all(ownRoster.map(async (player) => {
      const stats = await getGameStatsByPlayerAndGameId(player.player_id, gameId);
      console.log(sql2json(stats))
      return { ...sql2json(stats), name: player.name }
    }
    ))

    //team stats
    const ownTeamStats = await getTeamGameStatsByTeamAndGameId(ownTeamId, gameId)

    return res.status(200).json({ gameId, ownRosterStats, ownTeamStats })
  }

  async function postGameStats() {
    const { ownTeamId, opponent, players, team } = req.body
    let [gameId] = await getGameIdByTeamIds(ownTeamId, opponent)
    if (!gameId) {
      gameId = await createNewGameId(ownTeamId, opponent)
    } else {
      gameId = gameId.game_id
    }

    const teamRes = await executeQuery({
      query: "INSERT INTO game_stats_team(team_id, game_id, pip, lead, poss, tf, `2nd`, bench, fbp, pipm, pipa) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      values: [ownTeamId, gameId, team.pip, team.lead, team.poss, team.tf, team["2nd"], team.bench, team.fbp, team.pipm, team.pipa]
    })

    const playerRes = await Promise.all(players.map(async (player) => {
      try {
        if (player.min) {
          return await executeQuery({
            query: "INSERT INTO game_stats(player_id, game_id, min, pkt, reb, ast, stl, blk, `to`, fgm, fga, `3ptm`, `3pta`, ftm, fta, oreb, pf, pls_mns, starter, pog) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [player.id, gameId, player.min, player.pkt, player.reb, player.ast, player.stl, player.blk, player.to, player.fgm, player.fga, player["3ptm"], player["3pta"], player.ftm, player.fta, player.oreb, player.pf, player.pls_mns, +player.starter, +player.pog]
          })
        }
      } catch (error) {
        return
      }
    }))
    return res.status(200).json({ teamRes, playerRes })

  }
}


