const { asyncExec } = require("../utils");
const { readFile, writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.installDependencies = async (dir) => {
  // install dependencies
  let dependencies = [
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
  let devDependencies = [
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
  await writeFile(
    resolve(dir, "package.json"),
    JSON.stringify(packageDotJson),
    {
      encoding: "utf-8",
    }
  );
};
