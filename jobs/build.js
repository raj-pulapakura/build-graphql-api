const { dir } = require("../index");
const { asyncExec } = require("../utils");

module.exports.build = async () => {
  await asyncExec(`cd ${dir} && tsc`);
};
