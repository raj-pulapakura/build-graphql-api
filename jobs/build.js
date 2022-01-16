const { asyncExec } = require("../utils");

module.exports.build = async (dir) => {
  await asyncExec(`cd ${dir} && tsc`);
};
