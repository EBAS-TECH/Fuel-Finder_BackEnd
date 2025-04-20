npm init -y
npm i express dotenv pg cors joi uuid 
npm i cookie-parser bcryptjs jsonwebtoken

npm i --save--dev nodemon 



docker pull postgres

docker run --name postgres-db -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres