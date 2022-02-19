INSERT INTO dynedb.roster(team_id, player_id, season, ovr, pos, salary, length, birds, birds_possible, rookiescale, traded, no_max, `option`, yit, team_prev)
  SELECT teaminfoID, dyne_old.playerdb.playerID ,dyne_old.roster.season, dyne_old.roster.ovr, dyne_old.roster.pos, dyne_old.roster.salary, dyne_old.roster.length,0,0,0,0,0,0,dyne_old.roster.yearsInTeam,dyne_old.roster.team_prev
    from dyne_old.roster 
      JOIN (SELECT MAX(teaminfoID) as teaminfoID, team_abr FROM dyne_old.teaminfo GROUP BY team_abr) t ON dyne_old.roster.Team=t.team_abr
      JOIN dyne_old.playerdb ON 
        dyne_old.roster.forename=dyne_old.playerdb.forename AND
        dyne_old.roster.name=dyne_old.playerdb.name;