// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

fs.copyFileSync('./data/schema.graphql', '../standup-front/data/schema.graphql');
