create table holding_pen
(
    Number   int  null,
    Year     int  null,
    Album    text null,
    Artist   text null,
    Genre    text null,
    subgenre text null
);



select * from holding_pen


insert into album(title, year, ranking)
select REPLACE(
     TRIM(BOTH ']' FROM
    TRIM(BOTH '[' FROM
        TRIM(BOTH '"' FROM `Album`)
    )),
BINARY '�', 'a' ) name, Year, Number Ranking from holding_pen


select * from album order by ranking

