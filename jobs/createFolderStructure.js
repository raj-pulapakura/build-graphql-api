const { resolve } = require("path");
const { mkdir } = require("fs").promises;
const { dir } = require("../index");

module.exports.createFolderStructure = async () => {
  const paths = [
    resolve(dir, "dist"),
    resolve(dir, "src"),
    resolve(dir, "src", "config"),
    resolve(dir, "src", "features"),
    resolve(dir, "src", "objects"),
    resolve(dir, "src", "utils"),
  ];

  for (const p of paths) {
    await mkdir(p);
  }
};
