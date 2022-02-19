INSERT INTO dynedb.team(
    team_id,
    name,
    short,
    code,
    color1,
    color2,
    font1,
    font2,
    start,
  end,
  old_id
)
SELECT teaminfoID,
  team_long,
  team_short,
  team_abr,
  color1,
  color2,
  fontcol1,
  fontcol2,
  season_start,
  season_end,
  teamID
FROM dyne_old.`teaminfo`