# build app
FROM node:lts-alpine as builder
ENV NODE_ENV production
WORKDIR /app
# openssl fix https://github.com/prisma/prisma/issues/16553
RUN apk add --update --no-cache openssl1.1-compat 
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn prisma generate
RUN yarn build
CMD ["yarn", "start:prod"]
