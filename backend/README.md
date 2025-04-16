[![NestJs][nestjs-shield]][ref-nestjs]
[![NodeJs][nodejs-shield]][ref-nodejs]
[![Typescript][typescript-shield]][ref-typescript]
[![MongoDB][mongodb-shield]][ref-mongodb]
[![JWT][jwt-shield]][ref-jwt]
[![Jest][jest-shield]][ref-jest]
[![Docker][docker-shield]][ref-docker]

# Motorbike System Backend 🔥 🚀

> This repo will representative of a motorbike system service

You can follow the guideline below to run it

## Table of contents

- [Motorbike system backend 🔥 🚀](#motorbike-system-backend--)
  - [Table of contents](#table-of-contents)
  - [Important](#important)
  - [TODO](#todo)
  - [Prerequisites](#prerequisites)
  - [Build with](#build-with)
  - [Objective](#objective)
  - [Features](#features)
    - [Main Features](#main-features)
  - [Installation](#installation)
    - [Clone Repo](#clone-repo)
    - [Install Dependencies](#install-dependencies)
    - [Create a user in mongo](#create-mongo-user)
    - [Create environment](#create-environment)
    - [Database Migration and Seed](#database-migration-and-seed)
    - [Run Project](#run-project)
  - [Installation with Docker](#installation-with-docker)
  - [Test](#test)
  - [Swagger](#swagger)
  - [License](#license)

## Important

> Very limited documentation

- Stateful Authorization, using `redis-session` and `JWT`.
- If you change the environment value of `APP_ENV` to `production`, it will disable Documentation.

## TODO

## Prerequisites

We assume that everyone who comes here is **`programmer with intermediate knowledge`** and we also need to understand more before we begin in order to reduce the knowledge gap.

1. Understand [NestJs Fundamental][ref-nestjs], Main Framework. NodeJs Framework with support fully TypeScript.
2. Understand [Typescript Fundamental][ref-typescript], Programming Language. It will help us to write and read the code.
3. Understand [ExpressJs Fundamental][ref-nodejs], NodeJs Base Framework. It will help us in understanding how the NestJs Framework works.
4. Understand what and how database works, especially NoSql and [MongoDB.][ref-mongodb]
5. Understand Repository Design Pattern or Data Access Object Design Pattern. It will help to read, and write the source code
6. Understand The SOLID Principle and KISS Principle for better write the code.
7. Optional. Understand Microservice Architecture. It can help you to understand more deep about this project.
8. Optional. Understanding [The Twelve Factor Apps][ref-12factor]. It can help to serve the project.
9. Optional. Understanding [Docker][ref-docker].

## Build with

Describes which version.

| Name           | Version  |
| -------------- | -------- |
| NestJs         | v11.x    |
| NestJs Swagger | v11.0.x  |
| Node           | v22.11.x |
| Typescript     | v5.7.x   |
| Mongoose       | v11.0.x  |
| MongoDB        | v8.x     |
| Yarn           | v1.22.x  |
| Docker         | v27.4.x  |
| Docker Compose | v2.31.x  |

## Objective

- Easy to maintenance
- NestJs Habit
- Component based / modular folder structure
- Stateful authentication and authorization
- Repository Design Pattern
- Follow Community Guide Line
- Follow The Twelve-Factor App

## Features

### Main Features

- NestJs 11.x 🥳
- Typescript 🚀
- Production ready 🔥
- MongoDB integrate by using [mongoose][ref-mongoose] 🎉
- Logger with pino 🌲
- Repository Design Pattern.
- Export data with CSV or Excel by using `decorator`.
- Support multi-language `i18n` 🗣, can controllable with request header `x-custom-lang`
- Request validation for all request params, query, dan body with `class-validation`
- Swagger / OpenAPI 3 included.
- Url Versioning, default version is `1`.
- Server Side Pagination.
- Support Docker installation.
- Husky GitHook for run linter before commit 🐶.
- Linter with EsLint for Typescript.

## Installation

Before start, we need to install some packages and/or tools.
The recommended version is the LTS version for every tool and package.

> Make sure to check that tools have been installed successfully.

1. [NodeJs][ref-nodejs]
2. [MongoDB][ref-mongodb]
3. [Redis][ref-redis]
4. [Yarn][ref-yarn]
5. [Git][ref-git]

### Clone Repo

Clone the project with git.

```bash
git clone
```

### Install Dependencies

This project needs some dependencies. Let's go install it.

```bash
yarn install
```

### Create Mongo User

Open Mongo CLI

```bash
use motorbike_system
```

```bash
db.createUser({ user: "mongo", pwd: "changeme", roles: [{ role: "readWrite", db: "motorbike_system" }] });
```

You now can connect to mongodb with these credentials

### Create environment

Make your own environment file with a copy of `env.example` and adjust values to suit your own environment.

```bash
cp .env.example .env
```

### Database Migration and Seed

> By default the options of `AutoCreate` and `AutoIndex` will be `false`. Thats means the schema in MongoDb will not change with the latest update.

in the first place, you need to update the schema

```bash
yarn migrate:schema
```

After migrate the schema, also we need to run data seed

```bash
yarn migrate:seed
```

For rollback

```bash
yarn migrate:remove
```

### Run Project

Finally, Cheers 🍻🍻 !!! you passed all steps.

Now you can run the project.

```bash
yarn start:dev
```

## Installation with Docker

We need more tools to be installed.

1. [Docker][ref-docker]
2. [Docker-Compose][ref-dockercompose]

Copy `.env.example` and change value

```bash
cp .env.example .env
```

Run docker compose

> if `host.docker.internal` cannot be resolved, you must add a line in your `/etc/hosts` file to map `host.docker.internal` to the IP address `127.0.0.1`

```bash
docker-compose up -d
```

## Test

The project only provide `unit testing`.

```bash
yarn test
```

## Swagger

You can check The Swagger after running this project. Url `localhost:3000/docs`

## User

See it in `/migration/seeds/user`

## License

Distributed under [MIT licensed][license].

## Contribute

We welcome contributions to this project! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

If your branch is behind the `origin/main` branch, please update your branch and resolve any conflicts before opening a pull request.

## Contact

[Author][author-email]

<!-- BADGE LINKS -->

[nestjs-shield]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[mongodb-shield]: https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B
[jwt-shield]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[jest-shield]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[yarn-shield]: https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white
[docker-shield]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[github-shield]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white

<!-- CONTACTS -->

[author-email]: mailto:thuan.jolly@gmail.com

<!-- Repo LINKS -->

[motorbike-issues]: https://example.com/

<!-- license -->

[license]: LICENSE.md

<!-- Reference -->

[ref-nestjs]: http://nestjs.com
[ref-mongoose]: https://mongoosejs.com
[ref-mongodb]: https://docs.mongodb.com/
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-docker]: https://docs.docker.com
[ref-dockercompose]: https://docs.docker.com/compose/
[ref-yarn]: https://yarnpkg.com
[ref-npm]: https://npmjs.com
[ref-12factor]: https://12factor.net
[ref-nestjscommand]: https://gitlab.com/aa900031/nestjs-command
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-git]: https://git-scm.com
[ref-redis]: https://redis.io
