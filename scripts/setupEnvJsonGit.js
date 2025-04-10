const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function setupEnvJsonGit(appName) {
  // .env dosyası
  console.log("📄 .env dosyası oluşturuluyor...");
  fs.writeFileSync(
    ".env",
    `API_URL=https://api.example.com\nAPP_NAME=${appName}\nENV=development\n`
  );

  // app.json
  console.log("⚙️ app.json özelleştiriliyor...");
  const appJsonPath = path.join("app.json");
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
  appJson.expo.name = appName;
  appJson.expo.slug = appName.toLowerCase();
  appJson.expo.version = "1.0.0";
  appJson.expo.orientation = "portrait";
  appJson.expo.splash = {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  };
  appJson.expo.updates = {
    fallbackToCacheTimeout: 0,
  };
  appJson.expo.extra = {
    env: "development",
  };
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

  // git init
  console.log("🔧 Git başlatılıyor...");
  execSync("git init", { stdio: "inherit" });
  execSync("git add .", { stdio: "inherit" });
  execSync('git commit -m "Initial commit 🚀"', { stdio: "inherit" });
}

module.exports = { setupEnvJsonGit };