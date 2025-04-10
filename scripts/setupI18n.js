const fs = require("fs");
const path = require("path");

function setupI18n(appName) {
  console.log("🌍 i18n yapılandırılıyor...");

  // utils/i18n.ts
  const utilsDir = path.join("source", "utils");
  fs.mkdirSync(utilsDir, { recursive: true });

  fs.writeFileSync(
    path.join(utilsDir, "i18n.ts"),
    `
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

import en from "@locales/en.json";
import tr from "@locales/tr.json";

const i18n = new I18n({
  en,
  "en-TR": tr,
  "tr-TR": tr,
  "en-US": tr,
});

i18n.locale = Localization.getLocales()[0].languageTag;
i18n.enableFallback = true;

export default i18n;
`.trim()
  );

  // locales/en.json ve tr.json
  console.log("📝 Lokalizasyon dosyaları ekleniyor...");

  const localesDir = path.join("source", "locales");
  fs.mkdirSync(localesDir, { recursive: true });

  fs.writeFileSync(
    path.join(localesDir, "en.json"),
    JSON.stringify(
      {
        welcome: "Welcome to the app!",
        language: "Language",
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(localesDir, "tr.json"),
    JSON.stringify(
      {
        welcome: "Uygulamaya hoş geldin!",
        language: "Dil",
      },
      null,
      2
    )
  );
}

module.exports = { setupI18n };
