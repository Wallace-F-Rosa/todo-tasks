# build app
FROM node:lts-alpine as builder
ENV NODE_ENV production
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN yarn prisma generate
RUN yarn build
CMD ["yarn", "start:prod"]
