const { writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.createEnvFile = async (dir, session) => {
  if (session) {
    await writeFile(
      resolve(dir, ".env"),
      `PORT=80
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DATABASE=
REDIS_PORT=
REDIS_HOST=
  `,
      { encoding: "utf-8" }
    );
  } else {
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
  }
};
