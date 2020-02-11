FROM node:12-alpine

WORKDIR /server
COPY package.json index.js dist /server/
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
