const { writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.createUtils = async (dir) => {
  // create utils/connectToDB.ts
  await writeFile(
    resolve(dir, "src", "utils", "connectToDB.ts"),
    `import { Connection, createConnection } from "typeorm";
import { dbConfig } from "../config/db";
import { delay } from "./delay";

export const connectToDB = async (): Promise<Connection> => {
  try {
    console.log("Trying to connect to db");
    const conn = await createConnection(dbConfig);
    console.log("Connected to db");
    return conn;
  } catch (e) {
    console.log("Failed to connect to db because...");
    console.error(e);
    await delay(3000);
    return await connectToDB();
  }
};
`,
    {
      encoding: "utf-8",
    }
  );

  // create delay.ts
  await writeFile(
    resolve(dir, "src", "utils", "delay.ts"),
    `export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
`,
    {
      encoding: "utf-8",
    }
  );
};
