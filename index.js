#!/usr/bin/env node

// MODULES
const argv = require("minimist")(process.argv.slice(2));
const { mkdir } = require("fs").promises;
const colors = require("colors");

// JOBS
const { createPackageDotJson } = require("./jobs/createPackageDotJson");
const { installDependencies } = require("./jobs/installDependencies");
const { addScripts } = require("./jobs/addScripts");
const { createTsConfigDotJson } = require("./jobs/createTsConfigDotJson");
const { createFolderStructure } = require("./jobs/createFolderStructure");
const { createEnvFile } = require("./jobs/createEnvFile");
const { createMainFiles } = require("./jobs/createMainFiles");
const { createConfigFiles } = require("./jobs/createConfigFiles");
const { createObjects } = require("./jobs/createObjects");
const { createUtils } = require("./jobs/createUtils");
const { createBookFeature } = require("./jobs/createBookFeature");
const { createAuthorFeature } = require("./jobs/createAuthorFeature");
const { createIndexDotTs } = require("./jobs/createIndexDotTs");
const { build } = require("./jobs/build");

const main = async () => {
  const [dir] = argv._;

  if (!dir) {
    throw new Error("\n📂 Please enter a directory!");
  }

  if (dir !== ".") {
    await mkdir(dir);
  }

  console.log("\n📃 Creating package.json...");
  await createPackageDotJson(dir);

  console.log("\n🌐 Installing dependencies... (this might take a while)");
  await installDependencies(dir);

  console.log("\n🔨 Adding scripts...");
  await addScripts(dir);

  console.log("\n🦸 Configuring Typescript...");
  await createTsConfigDotJson(dir);

  console.log("\n🌳 Setting up environment...");
  await createFolderStructure(dir);

  await createEnvFile(dir);

  await createMainFiles(dir);

  await createConfigFiles(dir);

  console.log("\n👍 Creating utils...");
  await createUtils(dir);

  console.log("\n🏆 Creating examples...");
  await createObjects(dir);

  await createAuthorFeature(dir);

  await createBookFeature(dir);

  console.log("\n🛫 Bringing it all together...");
  await createIndexDotTs(dir);

  await build(dir);

  console.log(
    "\nPlease go to https://www.npmjs.com/package//create-graphql-server"
      .green.bold
  );

  console.log("");
  if (dir !== ".") {
    console.log(`\t- cd ${dir}`);
  }

  console.log("\t- npm run dev");
};

main().catch((e) => {
  console.log(e);
});
