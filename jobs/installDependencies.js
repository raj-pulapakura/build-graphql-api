const { asyncExec } = require("../utils");
const { readFile, writeFile } = require("fs").promises;
const { dir } = require("../index");

module.exports.installDependencies = async () => {
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

  // get package.json
  const raw = await readFile(resolve(dir, "package.json"), {
    encoding: "utf-8",
  });
  const packageDotJson = JSON.parse(raw);

  packageDotJson["dependencies"]["graphql"] = "15.3.0";

  // write back
  await writeFile(resolve(dir, "package.json"), packageDotJson, {
    encoding: "utf-8",
  });
};
