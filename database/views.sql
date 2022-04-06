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