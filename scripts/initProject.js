const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function initProject(appName) {
  console.log(`🚀 ${appName} projesi oluşturuluyor...`);
  execSync(`npx create-expo-app ${appName} -t expo-template-blank-typescript`, {
    stdio: "inherit",
  });

  process.chdir(appName);

  // App.tsx siliniyor
  console.log("🗑️ App.tsx kaldırılıyor (expo-router kullanılıyor)...");
  fs.rmSync("App.tsx", { force: true });
}

module.exports = { initProject };