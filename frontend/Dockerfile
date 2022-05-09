# syntax=docker/dockerfile:1

FROM node:16.14.2

ENV NODE_ENV=development

WORKDIR /frontend

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 9229

CMD ["sh", "-c", "npm run build && npm start"]