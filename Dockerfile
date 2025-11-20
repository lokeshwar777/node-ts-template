# FROM node:24-alpine
# WORKDIR /app
# COPY package.json /app/
# RUN npm i
# COPY . /app/
# RUN npm run build
# EXPOSE 3000
# CMD [ "npm", "run", "start" ]

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
