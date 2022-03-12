# Hall Of Fame Web Application
Overview goes here.

# Database
We use the following technologies:
- MySql
    - MySQL is the provider we have selected for this project.
- Flyway
    - Flyway is a tool that looks at database scripts and executes them to get a database into a specific state.

In order to get MySql running and for flyway to run we use the command command while in the root hall of fame directory:

```
docker compose up
```

# Web
This application is written in php and uses `atk4/ui` to serve the website. To run the application simply navigate into the server directory and type:

```
php -S localhost:8080
```

Once this has been you, you can navigate to the website at: http://localhost:8080/


# Run Application Step by Step

1. Open Terminal - iTerm.
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`.
3. Type `code .` to open visual studio code.
4. Execute `docker compose up` in the terminal.
5. Application should be running.
6. Open another tab in terminal - Menu > Shell > Add Tab.
7. Navigate new tab into UI - `cd Desktop/HallOfFame/ui`.
8. Run `npm i` for first usage.
9. Run `npm start` to run the react application.

# If you need to adjust code locally

1. Open Terminal - iTerm.
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`.
3. Type `code .` to open visual studio code.
4. Open `docker-compose.yaml` and remove the api section:
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

# Stop Application

To stop the application runnung in docker compose or if you're running `php -S localhost:8080`, simply press control + c. This issues a signal to terminate the application (SIGTERM).

# Clear database Step by Step

In the event that we need to clear down the database from testing content or to make changes to the tables the follow steps should be followed:

1. Open Terminal - iTerm.
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`.
3. Run `docker compose down`.
4. Run `docker volume prune --force`.