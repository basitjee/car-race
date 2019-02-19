# Install Node-API App<br>

In the react project folder "node-api", run:<br>
npm install<br>
npm start<br>

# Environment variable

Please configure your database information in "docker-compose.yml" file.
Don't forget the put Postgres connection string on "DATABASE_URL" environment variable.
Or,
you can replace
"process.env.DATABASE_URL" on

- src/topUsers.js
- src/users.js

with your Postgres connection string
"postgres://POSTGRES_USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"

# DockerFile

Docker file is included on root of this project.
