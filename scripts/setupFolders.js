const fs = require("fs");
const path = require("path");

function setupFolders() {
  console.log("📁 source/ klasörü ve alt dizinleri oluşturuluyor...");

  const folders = [
    "components",
    "screens",
    "hooks",
    "services",
    "utils",
    "store",
    "locales",
  ];

  folders.forEach((folder) => {
    fs.mkdirSync(path.join("source", folder), { recursive: true });
  });

  console.log("📂 app/ klasörü oluşturuluyor (expo-router)...");

  fs.mkdirSync("app", { recursive: true });

  fs.writeFileSync(
    "app/+layout.tsx",
    `
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
`.trim()
  );
}

module.exports = { setupFolders };