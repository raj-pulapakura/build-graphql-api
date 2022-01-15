const { exec } = require("child_process");

module.exports.asyncExec = (command) => {
  return new Promise((resolve, reject) =>
    exec(command, (error, _stdout, _stderr) => {
      if (error) {
        return reject(error);
      }
      resolve();
    })
  );
};
