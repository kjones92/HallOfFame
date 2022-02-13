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
docker-compose up
```

In the event that we need to clear down the database from testing content or to make changes to the tables the follow steps should be followed:

1. Navigate to the root Hall Of Fame directory
2. Run `docker-compose down`
3. Run `docker volume prune --force`
4. Run `docker-compose up`

# Web
This application is written in php and uses `atk4/ui` to serve the website. To run the application simply navigate into the server directory and type:

```
php -S 127.0.0.1:8080
```

Once this has been you, you can navigate to the website at: http://localhost:8080/