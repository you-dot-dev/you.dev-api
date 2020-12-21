FROM node:lts-alpine3.12

WORKDIR /api-you-dev

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY api api
COPY lib lib

CMD ["node", "api"]
