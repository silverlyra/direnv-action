const core = require("@actions/core");
const cp = require("child_process");
const path = require("path");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const install = path.join(__dirname, "install-direnv.sh");

    const direnvInstalled = cp.spawnSync("command -v direnv");
    if (direnvInstalled.status !== 0) {
      core.info("Installing direnv");
      cp.execSync(`bash ${install}`, {
        encoding: "utf-8",
      });
    } else {
      core.info("direnv is already installed");
    }

    cp.execSync("direnv allow", { encoding: "utf-8" });
    const envs = JSON.parse(
      cp.execSync("direnv export json", { encoding: "utf-8" })
    );

    Object.keys(envs).forEach(function (name) {
      const value = envs[name];
      core.exportVariable(name, value);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
