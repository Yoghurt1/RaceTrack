# syntax=docker/dockerfile:1

FROM node:16.14.2

ENV NODE_ENV=development

WORKDIR /frontend

COPY ["package.json", "package-lock.json*", "./"]

COPY . .

RUN npm config set cache /tmp --global

RUN chown -R 1000:1000 "/tmp"

RUN npm install

EXPOSE 3000
EXPOSE 9229

CMD ["sh", "-c", "npm run build && npm run start-dev"]
