const fs = require("fs");

async function setupBabel() {
  console.log("🧠 babel.config.js expo-router için güncelleniyor...");

  const babelPath = "babel.config.js";
  let babelContent = "";

  if (fs.existsSync(babelPath)) {
    babelContent = fs.readFileSync(babelPath, "utf8");
  } else {
    console.log("📄 babel.config.js dosyası oluşturuluyor...");
    babelContent = `
export default function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'],
  };
}
`.trim();
    fs.writeFileSync(babelPath, babelContent);
    return;
  }

  // Mevcut içerikte "expo-router/babel" yoksa ekle
  if (!babelContent.includes("expo-router/babel")) {
    babelContent = babelContent.replace(
      /plugins:\s*\[/,
      "plugins: ['expo-router/babel', "
    );
    fs.writeFileSync(babelPath, babelContent);
  }
}

module.exports = { setupBabel };