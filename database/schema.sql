CREATE DATABASE IF NOT EXISTS dynedb;
CREATE TABLE `player` (
	`player_id` INT NOT NULL AUTO_INCREMENT,
	`first` varchar(255) NOT NULL,
	`last` varchar(255) NOT NULL,
	`img` varchar(255) NOT NULL,
	`birthdate` DATE NOT NULL,
	PRIMARY KEY (`player_id`)
);
CREATE TABLE `gm` (
	`gm_id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL UNIQUE,
	`password` varchar(255),
	`debut` tinyint UNSIGNED,
	`steam` varchar(255) NOT NULL UNIQUE,
	PRIMARY KEY (`gm_id`)
);
CREATE TABLE `gm2team` (
	`gm2team_id` INT NOT NULL AUTO_INCREMENT,
	`gm_id` INT NOT NULL,
	`team_id` INT NOT NULL,
	`season` INT NOT NULL,
	PRIMARY KEY (`gm2team_id`)
);
CREATE TABLE `season` (
	`season` smallint NOT NULL AUTO_INCREMENT,
	`year` year NOT NULL,
	`current` BOOLEAN NOT NULL,
	`title` varchar(255) NOT NULL,
	PRIMARY KEY (`season`)
);
CREATE TABLE `team` (
	`team_id` smallint NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`short` varchar(255) NOT NULL,
	`code` varchar(255) NOT NULL,
	`color1` char(7) NOT NULL,
	`color2` char(7) NOT NULL,
	`font1` char(7) NOT NULL,
	`font2` char(7) NOT NULL,
	`old_id` smallint NOT NULL,
	`start` smallint NOT NULL,
	`end` smallint,
	`logo` varchar(255) NOT NULL,
	PRIMARY KEY (`team_id`)
);
CREATE TABLE `game` (
	`game_id` INT NOT NULL AUTO_INCREMENT,
	`season` smallint UNSIGNED NOT NULL,
	`home` INT UNSIGNED NOT NULL,
	`away` INT UNSIGNED NOT NULL,
	`date` DATE NOT NULL,
	`type` enum('reg', 'po', 'cup', 'asg') NOT NULL DEFAULT 'reg',
	PRIMARY KEY (`game_id`)
);
CREATE TABLE `game_stats` (
	`game_stats_id` INT NOT NULL AUTO_INCREMENT,
	`player_id` INT NOT NULL,
	`game_id` INT NOT NULL,
	`min` smallint UNSIGNED,
	`pkt` smallint UNSIGNED,
	`reb` smallint UNSIGNED,
	`ast` smallint UNSIGNED,
	`stl` smallint UNSIGNED,
	`blk` smallint UNSIGNED,
	`to` smallint UNSIGNED,
	`fgm` smallint UNSIGNED,
	`fga` smallint UNSIGNED,
	`3ptm` smallint UNSIGNED,
	`3pta` smallint UNSIGNED,
	`ftm` smallint UNSIGNED,
	`fta` smallint UNSIGNED,
	`oreb` smallint UNSIGNED,
	`pf` smallint UNSIGNED,
	`pls_mns` smallint,
	`starter` bool NOT NULL,
	`pog` bool NOT NULL,
	PRIMARY KEY (`game_stats_id`)
);
CREATE TABLE `game_stats_team` (
	`game_stats_id` INT NOT NULL AUTO_INCREMENT,
	`team_id` INT NOT NULL,
	`game_id` INT NOT NULL,
	`pip` smallint NOT NULL,
	`lead` smallint UNSIGNED,
	`poss` TIME NOT NULL,
	`tf` smallint UNSIGNED,
	`2nd` smallint UNSIGNED,
	`bench` smallint UNSIGNED,
	`fbp` smallint UNSIGNED,
	`pipm` smallint UNSIGNED,
	`pipa` smallint UNSIGNED,
	PRIMARY KEY (`game_stats_id`)
);
CREATE TABLE `roster` (
	`roster_id` INT NOT NULL AUTO_INCREMENT,
	`team_id` INT NOT NULL,
	`player_id` INT NOT NULL,
	`season` INT NOT NULL,
	`ovr` smallint UNSIGNED NOT NULL,
	`pos` enum('PG', 'SG', 'SF', 'PF', 'C') NOT NULL,
	`salary` int UNSIGNED NOT NULL,
	`length` bool NOT NULL,
	`birds` bool NOT NULL DEFAULT '0',
	`birds_possible` bool NOT NULL DEFAULT '0',
	`rookiescale` bool NOT NULL DEFAULT '0',
	`traded` bool NOT NULL DEFAULT '0',
	`no_max` bool NOT NULL DEFAULT '0',
	`option` bool NOT NULL,
	`yit` smallint NOT NULL DEFAULT '0',
	`team_prev` smallint NOT NULL DEFAULT '0',
	PRIMARY KEY (`roster_id`)
);
ALTER TABLE `gm`
ADD CONSTRAINT `gm_fk0` FOREIGN KEY (`debut`) REFERENCES `season`(`season`);
ALTER TABLE `team`
ADD CONSTRAINT `team_fk0` FOREIGN KEY (`start`) REFERENCES `season`(`season`);
ALTER TABLE `gm2team`
ADD CONSTRAINT `gm2team_fk0` FOREIGN KEY (`season_id`) REFERENCES `season`(`season`);
ALTER TABLE `gm2team`
ADD CONSTRAINT `gm2team_fk1` FOREIGN KEY (`team_id`) REFERENCES `team`(`team_id`);
ALTER TABLE `gm2team`
ADD CONSTRAINT `gm2team_fk2` FOREIGN KEY (`gm_id`) REFERENCES `gm`(`gm_id`);
ALTER TABLE `game`
ADD CONSTRAINT `game_fk0` FOREIGN KEY (`season`) REFERENCES `season`(`season`);
ALTER TABLE `game`
ADD CONSTRAINT `game_fk1` FOREIGN KEY (`home`) REFERENCES `team`(`team_id`);
ALTER TABLE `game`
ADD CONSTRAINT `game_fk2` FOREIGN KEY (`away`) REFERENCES `team`(`team_id`);
ALTER TABLE `game_stats`
ADD CONSTRAINT `game_stats_fk0` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`);
ALTER TABLE `game_stats`
ADD CONSTRAINT `game_stats_fk1` FOREIGN KEY (`game_id`) REFERENCES `game`(`game_id`);
ALTER TABLE `game_stats_team`
ADD CONSTRAINT `game_stats_team_fk0` FOREIGN KEY (`team_id`) REFERENCES `team`(`team_id`);
ALTER TABLE `game_stats_team`
ADD CONSTRAINT `game_stats_team_fk1` FOREIGN KEY (`game_id`) REFERENCES `game`(`game_id`);
ALTER TABLE `roster`
ADD CONSTRAINT `roster_fk0` FOREIGN KEY (`team_id`) REFERENCES `team`(`team_id`);
ALTER TABLE `roster`
ADD CONSTRAINT `roster_fk1` FOREIGN KEY (`player_id`) REFERENCES `player`(`player_id`);
ALTER TABLE `roster`
ADD CONSTRAINT `roster_fk2` FOREIGN KEY (`season`) REFERENCES `player`(`player_id`);