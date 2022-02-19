# GraphQL API

This repository has the objective to configure a minimum API to be used and forked by future projects.

The configuration used in this repository represents the best practices to develop a GraphQL API.

This respository also aims to be a playground to test bleeding edges tools in develop a API. Feel free to contribute.

To get started you should have `yarn` installed and follow the commands:

1. Install dependencies:
```sh
yarn
```

2. Start the server:

With docker-compose:
```sh
HOSTUSER="$(id -u ${USER}):$(id -g ${USER})" docker-compose up api
```

Without docker-compose:
```sh
yarn start
```

Access http://localhost:5000/graphql

## Some tips

If you are using VSCode, you should install this recommended extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Graphql Extension](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

## More to come

This repo is in constant change.
The next steps are (not in that order):

- MongoDB configuration
- Jest configuration
- Coverage tool configuration
- Deploy support
- CI/CD configuration

## Some decisions and tools used in this repo

- [Babel](https://babeljs.io/): transpile typescript into javascript
- [apollo-server-express](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express): It enables to attach a GraphQL server to an existing Express server.
- [@commitlint](https://github.com/conventional-changelog/commitlint): lint commit messages.
- [husky](https://typicode.github.io/husky/#/): git hooks (pre-commit, lint commit message.
- [nodemon](https://nodemon.io/): monitor changes and restart server.
- [@graphql-tools](https://www.graphql-tools.com/): is a set of NPM packages and an opinionated structure for how to build a GraphQL schema and resolvers in JavaScript/TypeScript, following the GraphQL-first development workflow.
- [@graphql-codegen](https://www.graphql-code-generator.com/): to generate code (merged schema and types for typescript) from th GraphQL Schema.
- [@graphql-eslint](https://github.com/dotansimha/graphql-eslint): integrate GraphQL and ESLint to define rules to a better development experience.

## Useful commands

1. Build js and types
```sh
yarn build
```

2. Generate `data/schema.graphql` and `schema.ts` (types and interfaces for typescript)
```sh
yarn gen-schema-types
```

3. Lint code
```sh
yarn lint
```

4. Type check for typescript
```sh
yarn type-check
```
