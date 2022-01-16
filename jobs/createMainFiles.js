const { writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.createMainFiles = async (dir, session) => {
  // create types.ts
  if (!session) {
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
  } else {
    await writeFile(
      resolve(dir, "src", "types.ts"),
      `import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

export type EnvironmentVariables = {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_DATABASE: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  PORT: number;
} & NodeJS.ProcessEnv;

export interface Context {
  req: Request & {
    session: Session &
      Partial<SessionData> & { accountId: string; };
  };
  res: Response;
  redis: RedisClient;
}
`,
      { encoding: "utf-8" }
    );
  }

  // create constants.ts

  if (!session) {
    await writeFile(
      resolve(dir, "src", "constants.ts"),
      `import { EnvironmentVariables } from "./types";

export const env = process.env as EnvironmentVariables;
`,
      {
        encoding: "utf-8",
      }
    );
  } else {
    await writeFile(
      resolve(dir, "src", "constants.ts"),
      `import { EnvironmentVariables } from "./types";

export const env = process.env as EnvironmentVariables;
export const SECRET = "secret";
export const AUTH_COOKIE = "auth-cookie";
export const TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10;

`,
      {
        encoding: "utf-8",
      }
    );
  }
};
