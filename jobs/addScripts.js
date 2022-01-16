const { readFile, writeFile } = require("fs").promises;
const { resolve } = require("path");

module.exports.addScripts = async (dir) => {
  const raw = await readFile(resolve(dir, "package.json"), {
    encoding: "utf-8",
  });
  const packageDotJson = JSON.parse(raw);

  packageDotJson.scripts = {
    start: "node ./dist/index.js",
    dev: 'concurrently "tsc -w" "nodemon ./dist/index.js"',
  };

  await writeFile(
    resolve(dir, "package.json"),
    JSON.stringify(packageDotJson),
    {
      encoding: "utf-8",
    }
  );
};
