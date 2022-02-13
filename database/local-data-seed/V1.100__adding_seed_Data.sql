insert into album(title, year) values ('katrina Test Album', 2021);

insert into artist(name) values ('Katrina Jones');

insert into genre(description) values ('Rock');

insert into subgenre(description, genre_id) values ('Pop Rock', 1);

insert into artist_album(artist_id, album_id) values (1, 1);

insert into album_genre(album_id, genre_id) values (1,1);

insert into album_subgenre(album_id, subgenre_id) values (1 ,1);