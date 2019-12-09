FROM node:10

RUN mkdir -p /src/app

RUN npm install nodemon -g
RUN npm install gulp@3.9.1 -g
RUN npm install db-migrate -g
RUN npm install db-migrate-mysql -g
RUN npm install mocha -g

WORKDIR /src
ADD package.json package.json
RUN npm install
ADD database.json database.json
ADD migrations migrations

ADD nodemon.json nodemon.json
