const { asyncExec } = require("../utils");
const { dir } = require("../index");

module.exports.createPackageDotJson = async () => {
  await asyncExec(`cd ${dir} && npm init -y`);
};
