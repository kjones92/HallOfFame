# Hall Of Fame Web Application
A website to store and manage a music hall of fame. It permits:
- Adding and approving reviews
- User management
- Album administration
- Favourite and Owned tracking

# Database
We use the following technologies:
- MySql
    - MySQL is the provider we have selected for this project.
- Flyway
    - Flyway is a tool that read database scripts and executes them to get a database into a specific state. It tracks what has been executed in a table called `flyway_schema_history`.

In order to get MySql, flyway and the APi running we use the command while in the root hall of fame directory:

```
docker compose up
```

# Detailed Run Application Step by Step

1. Open Terminal.
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`.
3. Type `code .` to open visual studio code.
4. Execute `docker compose up` in the terminal.
5. Application should be running.
6. Open another tab in terminal - Menu > Shell > Add Tab.
7. Navigate new tab into UI - `cd Desktop/HallOfFame/ui`.
8. Run `npm i` for first usage.
9. Run `npm start` to run the react application.

# If you need to adjust api code locally

1. Open Terminal.
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`.
3. Type `code .` to open visual studio code.
4. Open `docker-compose.yaml` and comment the api section:
```
  api:
    build: ./server
    ports:
      - 8080:8080
    environment:
      HOST: "db"
      USERNAME: "user"
      PASSWORD: "password"
      DB: "greatest_albums"
    depends_on:
      - flyway
```
5. Execute `docker compose up` in the terminal.
6. Open another tab in terminal - Menu > Shell > Add Tab.
7. Navigate new tab into Server - `cd Desktop/HallOfFame/server`.
8. Execute - `php -S localhost:8080`.

# Web deploy
For the web application the URL we use for the APIs is hardcoded. This is held within `./ui/src/utils/fetch.js`. It must be manually adjusted and then we run `npm run build` to create our build folder to deploy.

# Stop Application

To stop the application running in docker compose or if you're running `php -S localhost:8080`, simply press `control + c`.

# Clear database Step by Step

In the event that we need to clear down the database from testing content or to make changes to the tables the follow steps should be followed:

1. Open Terminal.
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`.
3. Run `docker compose down`.
4. Run `docker volume prune --force`.