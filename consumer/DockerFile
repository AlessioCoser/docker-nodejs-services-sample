FROM node:8.9-alpine

WORKDIR /home/node

COPY ./package.json ./package.json
COPY ./lib ./lib
COPY ./app.js ./app.js

RUN npm install

CMD ["node", "app.js"]