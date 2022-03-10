# Database

Overview on how to start

# Data cleanup process

1. Create temporary table 
2. Import CSV into table
3. Migrate tables accross

```
insert into album(title, year, ranking)
select REPLACE(
     TRIM(BOTH ']' FROM
    TRIM(BOTH '[' FROM
        TRIM(BOTH '"' FROM `Album`)
    )),
BINARY '�', 'a' ) name, Year, Number Ranking from holding_pen
```