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

1. Open Terminal - iTerm
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`
3. Type `code .` to open visual studio code.
3. Execute `docker compose up` in the terminal.
3. Open another tab in terminal - Menu > Shell > Add Tab
4. Navigate new tab into Server - `cd Desktop/HallOfFame/Server`
5. Execute - `php -S localhost:8080`

# Stop Application Step by Step

1. Open root directory HallOfFame - Desktop/HallOfFame
2. Press control + c (kills the running docker compose)
3. Open server directory HallOfFame - Desktop/HallOfFame/Server
4. Press control + c (kills the running php process)

# Clear database Step by Step

In the event that we need to clear down the database from testing content or to make changes to the tables the follow steps should be followed:

1. Open Terminal - iTerm
2. Navigate into HallOfFame - `cd Desktop/HallOfFame`
3. Run `docker compose down`
4. Run `docker volume prune --force`