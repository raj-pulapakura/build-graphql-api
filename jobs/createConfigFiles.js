const { writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.createConfigFiles = async (dir, session) => {
  // create config/db.ts
  await writeFile(
    resolve(dir, "src", "config", "db.ts"),
    `import { ConnectionOptions } from "typeorm";
import { env } from "../constants";
import { BookEntity } from "../features/Book/BookEntity";
import { AuthorEntity } from "../features/Author/AuthorEntity";

export const dbConfig: ConnectionOptions = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  type: "mysql",
  synchronize: true,
  entities: [BookEntity, AuthorEntity]
};
`,
    {
      encoding: "utf-8",
    }
  );

  if (session) {
    // config/redis.ts
    await writeFile(
      resolve(dir, "src", "config", "redis.ts"),
      `import { env } from "../constants";
import { ClientOpts } from "redis";

export const redisConfig: ClientOpts = {
  port: env.REDIS_PORT,
  host: env.REDIS_HOST,
};
`,
      {
        encoding: "utf-8",
      }
    );
  }
};
