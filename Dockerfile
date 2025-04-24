FROM node:18

WORKDIR /app

COPY package.json  package-lock.json /app

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]