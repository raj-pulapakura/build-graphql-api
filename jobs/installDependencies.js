const { asyncExec } = require("../utils");

module.exports.installDependencies = async (dir) => {
  // install dependencies
  const dependencies = [
    "apollo-server",
    "apollo-server-express",
    "argon2",
    "concurrently",
    "cors",
    "dotenv",
    "express",
    "graphql",
    "mysql2",
    "reflect-metadata",
    "type-graphql",
    "typeorm",
    "uuid",
  ];

  for (const dep of dependencies) {
    await asyncExec(`cd ${dir} && npm i ${dep} --legacy-peer-deps`);
  }

  // install dev dependencies
  const devDependencies = [
    "@types/express",
    "@types/node",
    "@types/uuid",
    "nodemon",
    "typescript",
  ];

  for (const dep of devDependencies) {
    await asyncExec(`cd ${dir} && npm i -D ${dep} --legacy-peer-deps`);
  }
};
