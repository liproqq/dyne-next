import executeQuery, { sql2json } from 'lib/db';

import { apiHandler } from 'helpers/api';

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getGameStats();
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
}

const createNewGameId = async (home, away) => {
  const _ = await executeQuery({
    query:
      `INSERT INTO game(season, home, away, date) 
      VALUES ((SELECT season FROM season WHERE current=1), ?, ?, NOW());`,
    values: [home, away]
  })
  const gameId = await executeQuery({
    query: "SELECT LAST_INSERTED_ID()"
  })
  return gameId.game_id
}

const getCurrentTeamIdByGmName = async (gmName) => {
  let [ownTeamId] = await executeQuery({
    query: `SELECT team_id from gm2team
                JOIN gm ON gm2team.gm_id=gm.gm_id AND
                    season=(SELECT season FROM season WHERE current=1)
                WHERE gm.name=?`,
    values: [gmName]
  })
  return ownTeamId.team_id

}

const getGameIdByTeamIds = async (first, second) => {
  const gameId = await executeQuery({
    query:
      `
            SELECT game_id FROM game 
                WHERE (home=? or away=?) AND 
                  (home=? or away=?) AND
                  season=(SELECT season FROM season WHERE current=1);
          `,
    values: [first, first, second, second]
  })
  return gameId
}

const getCurrentRosterByTeamId = async (teamId) => {
  const roster = await executeQuery({
    query:
      `
            SELECT player.player_id, CONCAT(player.first," ",player.last) AS name FROM roster
            JOIN player ON roster.player_id=player.player_id
                WHERE roster.team_id=? AND
                  roster.season=(SELECT season FROM season WHERE current=1)
              ORDER BY roster.ovr DESC;
          `,
    values: [teamId]
  })
  return roster
}

const getGameStatsByPlayerAndGameId = async (playerId, gameId) => {
  const [stats] = await executeQuery({
    query:
      `
            SELECT * FROM game_stats
            WHERE player_id=? AND
                  game_id=?;
          `,
    values: [playerId, gameId]
  })
  return stats
}

const getTeamGameStatsByTeamAndGameId = async (teamId, gameId) => {
  const [stats] = await executeQuery({
    query:
      `
            SELECT * FROM game_stats_team
            WHERE team_id=? AND
                  game_id=?;
          `,
    values: [teamId, gameId]
  })
  return stats
}
