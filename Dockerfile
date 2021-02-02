FROM node:12.20.1-alpine3.10

WORKDIR /api-you-dev

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY api api
COPY lib lib

CMD ["node", "api"]
