CREATE TABLE `album` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `year` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `album_genre` (
  `id` int NOT NULL,
  `album_id` int NOT NULL,
  `genre_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `album_subgenre` (
  `id` int NOT NULL,
  `album_id` int NOT NULL,
  `subgenre_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `artist` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `artist_album` (
  `id` int NOT NULL,
  `artist_id` int NOT NULL,
  `album_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `artist_genre` (
  `id` int NOT NULL,
  `artist_id` int NOT NULL,
  `genre_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `artist_subgenre` (
  `id` int NOT NULL,
  `artist_id` int NOT NULL,
  `subgenre_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `genre` (
  `id` int NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `review` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `score` int NOT NULL,
  `date` datetime NOT NULL,
  `review_status_id` int NOT NULL,
  `album_id` int NOT NULL,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `review_status` (
  `id` int NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `role` (
  `id` int NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `subgenre` (
  `id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `genre_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_album` (
  `id` int NOT NULL,
  `is_favourite` boolean NOT NULL,
  `is_owned` boolean NOT NULL,
  `user_id` int NOT NULL,
  `album_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `marks_table` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `album`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `album_genre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_album_genre_album_id` (`album_id`),
  ADD KEY `FK_album_genre_genre_id` (`genre_id`);

ALTER TABLE `album_subgenre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_album_subgrene_album_id` (`album_id`),
  ADD KEY `FK_album_subgenre_subgenre_id` (`subgenre_id`);

ALTER TABLE `artist`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `artist_album`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_artist_album_artist_id` (`artist_id`),
  ADD KEY `FK_artist_album_album_id` (`album_id`);

ALTER TABLE `artist_genre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_artist_genre_genre_id` (`genre_id`),
  ADD KEY `FK_artist_genre_artist_id` (`artist_id`);

ALTER TABLE `artist_subgenre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_artist_subgenre_subgenre_subgenre_id` (`subgenre_id`),
  ADD KEY `FK_artist_subgenre_artist_id` (`artist_id`);

ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_review_review_status_id` (`review_status_id`),
  ADD KEY `FK_review_album_album_id` (`album_id`),
  ADD KEY `FK_review_user_user_id` (`user_id`);

ALTER TABLE `review_status`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `subgenre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_subgenre_genre_id` (`genre_id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_user_role_id` (`role_id`);

ALTER TABLE `user_album`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_user_album_user_id` (`user_id`),
  ADD KEY `FK_user_album_album_id` (`album_id`);

ALTER TABLE `album`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `album_genre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `album_subgenre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `artist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `artist_album`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `artist_genre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `artist_subgenre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `genre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `review_status`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `subgenre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `user_album`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `album_genre`
  ADD CONSTRAINT `FK_album_genre_album_id` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
  ADD CONSTRAINT `FK_album_genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);

ALTER TABLE `album_subgenre`
  ADD CONSTRAINT `FK_album_subgenre_subgenre_id` FOREIGN KEY (`subgenre_id`) REFERENCES `subgenre` (`id`),
  ADD CONSTRAINT `FK_album_subgrene_album_id` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`);

ALTER TABLE `artist_album`
  ADD CONSTRAINT `FK_artist_album_album_id` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
  ADD CONSTRAINT `FK_artist_album_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

ALTER TABLE `artist_genre`
  ADD CONSTRAINT `FK_artist_genre_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`),
  ADD CONSTRAINT `FK_artist_genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);

ALTER TABLE `artist_subgenre`
  ADD CONSTRAINT `FK_artist_subgenre_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`),
  ADD CONSTRAINT `FK_artist_subgenre_subgenre_subgenre_id` FOREIGN KEY (`subgenre_id`) REFERENCES `subgenre` (`id`);

ALTER TABLE `review`
  ADD CONSTRAINT `FK_review_album_album_id` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
  ADD CONSTRAINT `FK_review_review_status_id` FOREIGN KEY (`review_status_id`) REFERENCES `review_status` (`id`),
  ADD CONSTRAINT `FK_review_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `subgenre`
  ADD CONSTRAINT `FK_subgenre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);

ALTER TABLE `user`
  ADD CONSTRAINT `FK_user_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

ALTER TABLE `user_album`
  ADD CONSTRAINT `FK_user_album_album_id` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
  ADD CONSTRAINT `FK_user_album_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `marks_table`
  ADD PRIMARY KEY (`id`);

COMMIT;
