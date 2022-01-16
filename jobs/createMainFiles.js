const { writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.createMainFiles = async (dir, session) => {
  // create types.ts
  await writeFile(
    resolve(dir, "src", "types.ts"),
    `import { Request, Response } from "express";

export type EnvironmentVariables = {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_DATABASE: string;
  PORT: number;
} & NodeJS.ProcessEnv;

export interface Context {
  req: Request;
  res: Response;
}
`,
    { encoding: "utf-8" }
  );

  // create constants.ts

  await writeFile(
    resolve(dir, "src", "constants.ts"),
    `import { EnvironmentVariables } from "./types";

export const env = process.env as EnvironmentVariables;
`,
    {
      encoding: "utf-8",
    }
  );
};
