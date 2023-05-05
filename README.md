# A Mini Twitter 

## Prerequisites
- Docker
- Node >= 18.x

## Get Started
```bash
yarn install
docker compose up -d # For the mariaDB
yarn dev # For development
yarn prod # For Production or Docker Init Command
```
Then acces the frontend at http://localhost:4200/

## Get Started MariaDB
https://mariadb.com/kb/en/getting-started-with-the-nodejs-connector/
```bash
docker exec -it mariadb bash
mysql -u root -p
```
OR
- Go to http://localhost:8080