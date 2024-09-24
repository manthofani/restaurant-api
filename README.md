# Restaurant Simple system using nest JS

## Description

### Tech stack
- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- Mysql with Prisma
- Typescript
- Swagger UI (Not Fully Implemented in All API)
- Jest Unit Test 

## Project setup

- Create Mysql Database with name restaurant.
- Change the .env_example to .env and use your connection and schema

```bash
$ npm install
$ npx prisma generate
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests per-file
$ npm run test user.spec.ts
$ npm run test table.spec.ts
$ npm run test reservation.spec.ts
$ npm run test
```

## Resources

Check out Api Documentation in [doc](./doc/) folder
 
## About Me

- Author - [Tegar Manthofani]

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
