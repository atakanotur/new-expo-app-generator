const fs = require("fs");
const path = require("path");

function setupTsconfig() {
  console.log("📐 tsconfig.json alias path'leri güncelleniyor...");

  const tsconfigPath = path.join("tsconfig.json");
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

  tsconfig.compilerOptions = tsconfig.compilerOptions || {};
  tsconfig.compilerOptions.baseUrl = "./source";
  tsconfig.compilerOptions.paths = {
    "@components/*": ["components/*"],
    "@screens/*": ["screens/*"],
    "@hooks/*": ["hooks/*"],
    "@services/*": ["services/*"],
    "@utils/*": ["utils/*"],
    "@store/*": ["store/*"],
    "@locales/*": ["locales/*"],
    "@theme/*": ["theme/*"],
    "@constants/*": ["constants/*"],
    "@/*": ["./*"],
  };

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

module.exports = { setupTsconfig };