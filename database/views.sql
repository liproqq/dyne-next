CREATE VIEW `v_full_roster` AS
SELECT `r`.`roster_id` AS `roster_id`,
  `p`.`player_id` AS `player_id`,
  `t`.`team_id` AS `team_id`,
  `s`.`season` AS `season`,
  `p`.`first` AS `first`,
  `p`.`last` AS `last`,
  `t`.`name` AS `name`,
  `p`.`img` AS `img`,
  `p`.`birthdate` AS `birthdate`,
  `r`.`ovr` AS `ovr`,
  `r`.`pos` AS `pos`,
  `r`.`salary` AS `salary`,
  `r`.`length` AS `length`,
  `r`.`birds` AS `birds`,
  `r`.`birds_possible` AS `birds_possible`,
  `r`.`rookiescale` AS `rookiescale`,
  `r`.`traded` AS `traded`,
  `r`.`no_max` AS `no_max`,
  `r`.`option` AS `option`,
  `r`.`yit` AS `yit`,
  `r`.`team_prev` AS `team_prev`,
  `t`.`short` AS `short`,
  `t`.`code` AS `code`,
  `t`.`color1` AS `color1`,
  `t`.`color2` AS `color2`,
  `t`.`font1` AS `font1`,
  `t`.`font2` AS `font2`,
  `t`.`old_id` AS `old_id`,
  `t`.`start` AS `start`,
  `t`.`end` AS `end`,
  `t`.`logo` AS `logo`,
  `s`.`year` AS `year`,
  `s`.`current` AS `current`,
  `s`.`title` AS `title`
FROM (
    (
      (
        `roster` `r`
        JOIN `player` `p` ON (`r`.`player_id` = `p`.`player_id`)
      )
      JOIN `team` `t` ON (`r`.`team_id` = `t`.`team_id`)
    )
    JOIN `season` `s` ON (`r`.`season` = `s`.`season`)
  )
ORDER BY `p`.`player_id`,
  `s`.`season`;
CREATE OR REPLACE VIEW `v_game_outcome` AS
select `g`.`game_id` AS `game_id`,
  max(`g`.`season`) AS `season`,
  max(`g`.`home`) AS `home`,
  max(`g`.`away`) AS `away`,
  max(`g`.`date`) AS `date`,
  max(`g`.`type`) AS `type`,
  if(
    (
      sum(if((`r`.`team_id` = `g`.`home`), `gs`.`pkt`, 0)) > sum(if((`r`.`team_id` = `g`.`away`), `gs`.`pkt`, 0))
    ),
    max(`g`.`home`),
    max(`g`.`away`)
  ) AS `winner`,
  if(
    (
      sum(if((`r`.`team_id` = `g`.`home`), `gs`.`pkt`, 0)) < sum(if((`r`.`team_id` = `g`.`away`), `gs`.`pkt`, 0))
    ),
    max(`g`.`home`),
    max(`g`.`away`)
  ) AS `loser`
from (
    (
      `game` `g`
      join `game_stats` `gs` on((`g`.`game_id` = `gs`.`game_id`))
    )
    join `roster` `r` on(
      (
        (`g`.`season` = `r`.`season`)
        and (`gs`.`player_id` = `r`.`player_id`)
      )
    )
  )
group by `g`.`game_id`;
CREATE OR REPLACE VIEW `v_standings` AS
SELECT IF(
    w.team IS NOT NULL,
    w.season,
    l.season
  ) AS season,
  IF(w.team IS NOT NULL, w.team, l.team) AS team,
  IF(ISNULL(wins), 0, wins) AS wins,
  losses
FROM (
    SELECT season,
      loser AS team,
      COUNT(1) AS losses
    FROM dynedb.v_game_outcome
    go
    GROUP BY loser,
      season
  ) l
  LEFT JOIN (
    SELECT season,
      winner AS team,
      COUNT(winner) AS wins
    FROM dynedb.v_game_outcome
    go
    GROUP BY winner,
      season
  ) w ON l.team = w.team
UNION
SELECT IF(
    w.team IS NOT NULL,
    w.season,
    l.season
  ) AS season,
  IF(w.team IS NOT NULL, w.team, l.team) AS team,
  wins,
  IF(ISNULL(losses), 0, losses) AS losses
FROM (
    SELECT season,
      loser AS team,
      COUNT(1) AS losses
    FROM dynedb.v_game_outcome
    go
    GROUP BY loser,
      season
  ) l
  RIGHT JOIN (
    SELECT season,
      winner AS team,
      COUNT(winner) AS wins
    FROM dynedb.v_game_outcome
    go
    GROUP BY winner,
      season
  ) w ON l.team = w.team;
;