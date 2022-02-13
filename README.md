# HallOfFame
Overview goes here.

# Database
We use the following technologies:
- MySql

MySQL is the provider we have selected for this project.

- Flyway

Flyway is a tool that looks at database scripts and executes them to get a database into a specific state.


In order to get MySql running and for flyway to run we use the command command while in the root hall of fame directory:

```
docker-compose up
```

# Web
This application is written in php and uses `atk4/ui` to serve the website. To run the application simply navigate into the server directory and type:

```
php -S 127.0.0.1:8080
```

Once this has been you, you can navigate to the website at: http://localhost:8080/