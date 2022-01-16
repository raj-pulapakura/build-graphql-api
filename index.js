#!/usr/bin/env node

// MODULES
const argv = require("minimist")(process.argv.slice(2));
const { mkdir } = require("fs").promises;

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

const [dir] = argv._;
const { session } = argv;

module.exports = {
  dir,
  session,
};

const main = async () => {
  if (!dir) {
    throw new Error("\n📂 Please enter a directory!");
  }

  if (dir !== ".") {
    await mkdir(dir);
  }

  console.log("\n📃 Creating package.json...");
  await createPackageDotJson();

  console.log("\n🌐 Installing dependencies... (this might take a while)");
  await installDependencies();

  console.log("\n🔨 Adding scripts...");
  await addScripts();

  console.log("\n🦸 Configuring Typescript...");
  await createTsConfigDotJson();

  console.log("\n🌳 Setting up environment...");
  await createFolderStructure();

  await createEnvFile();

  await createMainFiles();

  await createConfigFiles();

  console.log("\n👍 Creating utils...");
  await createUtils();

  console.log("\n🏆 Creating examples...");
  await createObjects();

  await createAuthorFeature();

  await createBookFeature();

  console.log("\n🛫 Bringing it all together...");
  await createIndexDotTs();

  await build();

  console.log(
    "\nPlease go to https://www.npmjs.com/package/build-graphql-api for further instructions"
      .green.bold
  );
};

main().catch((e) => {
  console.log(e);
});
