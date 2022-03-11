-- 1. Create holding pen table
create table holding_pen
(
    Number   int  null,
    Year     int  null,
    Album    text null,
    Artist   text null,
    Genre    text null,
    subgenre text null
);

-- 2. import from CSV file into database directly

-- using datagrip to import from file

-- 3 Clean up holding pen with below scripts

-- Album Cleanup
update holding_pen set Album =
REPLACE(
    TRIM(BOTH ']' FROM
     TRIM(BOTH '[' FROM
          TRIM(BOTH '"' FROM `Album`)
         )
    ),BINARY '�', 'a'
);

-- Artist Cleanup
update holding_pen set artist =
REPLACE(
    artist, BINARY '�', ' '
)  ;

-- Genre Cleanup
update holding_pen set Genre =
LTRIM(
    RTRIM(
        REPLACE(
            REPLACE(
                REPLACE(Genre, BINARY 'Folk,', 'Folk'),
            BINARY 'World,', 'World'),
        BINARY '�', '')
    )
);


-- Sub Genre Cleanup
update holding_pen set subgenre =
LTRIM(
    RTRIM(
        substring_index(
            REPLACE(subgenre, BINARY '�', ''),
        ',', -1)
    )
);

-- 4. Get data into real tables

-- insert albums
insert into album (title, year, ranking)
select Album, year, number
from holding_pen;

-- insert artists
insert into artist (name)
select distinct Artist
from holding_pen;

-- insert genres
insert into genre (description)
select distinct  LTRIM(substring_index(Genre, ',', -1))
from holding_pen;

-- insert subgenres
insert into subgenre (description)
select distinct  LTRIM(substring_index(subgenre, ',', -1))
from holding_pen;

-- insert artist albums
insert into artist_album(artist_id, album_id)
select a.Id artist_id, a2.Id album_id
from holding_pen hp
inner join artist a on a.name = hp.Artist
inner join album a2 on hp.Album = a2.title;

-- inset album genres
insert into album_genre(album_id, genre_id)
select a.Id album_id, g.id genre_id
from holding_pen hp
inner join album a on a.title = hp.Album
inner join genre g on hp.Genre like CONCAT('%', g.description, '%');

-- insert album subgenres
insert into album_subgenre(album_id, subgenre_id)
select a.Id album_id, sg.id subgenre_id
from holding_pen hp
inner join album a on a.title = hp.Album
inner join subgenre sg on hp.subgenre like CONCAT('%', sg.description, '%');

-- 5. Fix the folk, world & country
update genre set description = 'Folk, World & Country' where description = 'Folk World & Country'