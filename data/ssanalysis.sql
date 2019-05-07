SET NAMES utf8mb4;

DROP TABLE IF EXISTS `subreddits`;
SET character_set_client = utf8mb4 ;
CREATE TABLE `subreddits` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `count` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46712 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dailyScores`;
SET character_set_client = utf8mb4;
CREATE TABLE `dailyScores` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `subredditId` int(11) unsigned NOT NULL,
  `score` double NOT NULL,
  `count` bigint(20) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`subredditId`) REFERENCES subreddits(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46712 DEFAULT CHARSET=utf8;
