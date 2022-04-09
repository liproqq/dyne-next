import executeQuery from 'lib/db';


export const createNewGameId = async (home, away) => {
  const { insertId: gameId } = await executeQuery({
    query: `INSERT INTO game(season, home, away, date) 
      VALUES ((SELECT season FROM season WHERE current=1), ?, ?, NOW());`,
    values: [home, away]
  });

  return gameId;
};

export const getCurrentTeamIdByGmName = async (gmName) => {
  let [ownTeamId] = await executeQuery({
    query: `SELECT team_id from gm2team
                JOIN gm ON gm2team.gm_id=gm.gm_id AND
                    season=(SELECT season FROM season WHERE current=1)
                WHERE gm.name=?`,
    values: [gmName]
  });
  return ownTeamId.team_id;

};

export const getGameIdByTeamIds = async (first, second) => {
  const gameId = await executeQuery({
    query: `
            SELECT game_id FROM game 
                WHERE (home=? or away=?) AND 
                  (home=? or away=?) AND
                  season=(SELECT season FROM season WHERE current=1);
          `,
    values: [first, first, second, second]
  });
  return gameId;
};

export const getCurrentRosterByTeamId = async (teamId) => {
  const roster = await executeQuery({
    query: `
            SELECT player.player_id, CONCAT(player.first," ",player.last) AS name FROM roster
            JOIN player ON roster.player_id=player.player_id
                WHERE roster.team_id=? AND
                  roster.season=(SELECT season FROM season WHERE current=1)
              ORDER BY roster.ovr DESC;
          `,
    values: [teamId]
  });
  return roster;
};

export const getGameStatsByPlayerAndGameId = async (playerId, gameId) => {
  const [stats] = await executeQuery({
    query: `
            SELECT * FROM game_stats
            WHERE player_id=? AND
                  game_id=?;
          `,
    values: [playerId, gameId]
  });
  return stats;
};

export const getTeamGameStatsByTeamAndGameId = async (teamId, gameId) => {
  const [stats] = await executeQuery({
    query: `
            SELECT * FROM game_stats_team
            WHERE team_id=? AND
                  game_id=?;
          `,
    values: [teamId, gameId]
  });
  return stats;
};

export const getCurrentStandings = async () => {
  const standings = await executeQuery({
    query: `
SELECT name, short, code, wins, losses FROM v_standings s
JOIN team t on t.team_id=s.team
WHERE (SELECT season FROM season WHERE current=1)
ORDER BY wins DESC, losses DESC;          `,
    values: []
  });
  return standings;
};
export const getRosterByTeamAndSeason = async (team, season) => {
  const roster = await executeQuery({
    query: `SELECT * FROM v_full_roster WHERE code=? AND season=?`,
    values: [team, season]
  });
  return roster;
};
