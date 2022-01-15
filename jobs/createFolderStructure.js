const { resolve } = require("path");
const { mkdir } = require("fs").promises;

module.exports.createFolderStructure = async (dir) => {
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
