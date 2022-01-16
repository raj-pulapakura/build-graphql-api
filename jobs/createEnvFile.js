const { writeFile } = require("fs").promises;
const { resolve } = require("path");
const { dir } = require("../index");

module.exports.createEnvFile = async () => {
  await writeFile(
    resolve(dir, ".env"),
    `PORT=80
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DATABASE=
  `,
    { encoding: "utf-8" }
  );
};
