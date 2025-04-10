const { execSync } = require("child_process");
const fs = require("fs");

const packages = [
  "zustand",
  "zod",
  "react-native-safe-area-context",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-hook-form",
  "moment",
  "i18n-js",
  "expo-localization",
  "@hookform/resolvers",
  "@shopify/flash-list",
  "@tanstack/react-query",
  "expo-router",
  "react-native-screens",
];

async function installPackages() {
  console.log("🔄 React 18.3.1 ve react-test-renderer kuruluyor...");
  execSync(`npm install react@18.3.1 react-test-renderer@18.3.1`, {
    stdio: "inherit",
  });

  console.log("📦 Paketler npm ile yükleniyor...");
  execSync(`npm install ${packages.join(" ")}`, { stdio: "inherit" });

  console.log("📝 package.json script'leri güncelleniyor...");
  const pkgJsonPath = "package.json";
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

  // Şimdilik test script'i burada değil — test setup dosyasında eklenecek
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}

module.exports = { installPackages };