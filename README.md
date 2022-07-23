# Todo service
[Todo App](https://github.com/Wallace-F-Rosa/todo-app) service that deals with task management(listing and CRUD operations). Communication is message-based.

## Installation

```bash
$ npm install
```

## Running the app

### Create the env file

- Copy the `.env.example` to `.env`
- Set the `DATABASE_URL` to yout postgres access url

### Run the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
