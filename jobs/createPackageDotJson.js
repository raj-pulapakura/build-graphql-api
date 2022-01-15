const { asyncExec } = require("../utils");

module.exports.createPackageDotJson = async (dir) => {
  await asyncExec(`cd ${dir} && npm init -y`);
};
