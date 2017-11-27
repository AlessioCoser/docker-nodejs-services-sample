FROM node:8.9-alpine

WORKDIR /home/node

COPY ./package.json ./package.json
RUN npm install

COPY . .

CMD ["node", "app.js"]