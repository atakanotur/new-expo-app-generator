#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const appName = process.argv[2];

if (!appName) {
  console.error("⚠️  Lütfen bir proje adı gir:");
  console.error("Kullanım: node create-rn-app.js myApp");
  process.exit(1);
}

// Kullanılacak npm paketleri
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

try {
  // Proje oluştur
  console.log(`🚀 ${appName} projesi oluşturuluyor...`);
  execSync(`npx create-expo-app ${appName} -t expo-template-blank-typescript`, {
    stdio: "inherit",
  });

  process.chdir(appName);

  //react ve react-test-renderer
  console.log("🔄 React 18.3.1 ve react-test-renderer kuruluyor...");
  execSync(`npm install react@18.3.1 react-test-renderer@18.3.1`, {
    stdio: "inherit",
  });

  // App.tsx siliniyor
  console.log("🗑️ App.tsx kaldırılıyor (expo-router kullanılıyor)...");
  fs.rmSync("App.tsx", { force: true });

  //index.ts siliniyor
  console.log("🗑️ index.ts kaldırılıyor...");
  fs.rmSync("index.ts", { force: true });

  // Kütüphaneler npm ile yükleniyor
  console.log("📦 Paketler npm ile yükleniyor...");
  execSync(`npm install ${packages.join(" ")}`, { stdio: "inherit" });

  console.log("📝 package.json script'leri güncelleniyor...");
  const pkgJsonPath = "package.json";
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // source/ klasör yapısı
  console.log("📁 source/ klasörü oluşturuluyor...");
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

  // .env
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

  // Zustand store
  console.log("🧠 Zustand store oluşturuluyor...");
  fs.writeFileSync(
    "source/store/useAppStore.ts",
    `
import { create } from 'zustand';

type AppState = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));
  `.trim()
  );

  // i18n config
  console.log("🌍 i18n yapılandırılıyor...");
  fs.writeFileSync(
    "source/utils/i18n.ts",
    `
    import * as Localization from "expo-localization";
    import { I18n } from "i18n-js";
    
    import fr from "@locales/en.json";
    import tr from "@locales/tr.json";
    
    const i18n = new I18n({
      fr,
      "en-TR": tr,
      "tr-TR": tr,
      "en-US": tr,
    });
    
    i18n.locale = Localization.getLocales()[0].languageTag;
    i18n.enableFallback = true;
    
    export default i18n;
    
  `.trim()
  );

  // Locale dosyaları
  console.log("📝 Lokalizasyon dosyaları ekleniyor...");
  fs.writeFileSync(
    "source/locales/en.json",
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
    "source/locales/tr.json",
    JSON.stringify(
      {
        welcome: "Uygulamaya hoş geldin!",
        language: "Dil",
      },
      null,
      2
    )
  );

  // HomeScreen
  console.log("📄 HomeScreen.tsx yazılıyor...");
  fs.writeFileSync(
    "source/screens/HomeScreen.tsx",
    `
import { View, Text, Button } from 'react-native';
import { useAppStore } from '@store/useAppStore';
import i18n from '@utils/i18n';

export default function HomeScreen() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const toggleLang = () => {
    const newLang = language === 'en' ? 'tr' : 'en';
    setLanguage(newLang);
    i18n.locale = newLang;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{i18n.t('welcome')}</Text>
      <Button title={i18n.t('language')} onPress={toggleLang} />
    </View>
  );
}
  `.trim()
  );

  // expo-router app/ klasörü
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

  fs.writeFileSync(
    "app/index.tsx",
    `
import HomeScreen from '@screens/HomeScreen';

export default function Index() {
  return <HomeScreen />;
}
`.trim()
  );

  // tsconfig alias path'leri (source klasörüne göre)
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
    "@/*": ["./*"],
  };
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

  // babel.config.js ayarı
  console.log("🧠 babel.config.js expo-router için güncelleniyor...");
  const babelPath = "babel.config.js";

  let babelContent = "";

  if (fs.existsSync(babelPath)) {
    babelContent = fs.readFileSync(babelPath, "utf8");
  } else {
    console.log("📄 babel.config.js dosyası oluşturuluyor...");
    babelContent = `
    export default function (api: any) {
      api.cache(true);
      return {
        presets: ['babel-preset-expo'],
        plugins: ['expo-router/babel'],
      };
    }
  `.trim();
    fs.writeFileSync(babelPath, babelContent);
  }

  if (!babelContent.includes("expo-router/babel")) {
    babelContent = babelContent.replace(
      /plugins: \[/,
      "plugins: ['expo-router/babel', "
    );
    fs.writeFileSync(babelPath, babelContent);
  }

  // Test bağımlılıkları
  console.log("🧪 Test ortamı kuruluyor (Jest + Testing Library)...");

  execSync(
    `npm install --save-dev jest jest-expo @testing-library/react-native@13.1.0 @testing-library/jest-native @types/jest ts-jest`,
    { stdio: "inherit" }
  );

  fs.writeFileSync(
    "jest.config.js",
    `
  module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
    transformIgnorePatterns: [
      "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo|@unimodules|sentry-expo|native-base)"
    ],
    testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  };
  `.trim()
  );

  fs.mkdirSync("source/__tests__", { recursive: true });
  fs.writeFileSync(
    "source/__tests__/App.test.tsx",
    `
import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "@screens/HomeScreen";

describe("HomeScreen", () => {
  it("renders welcome text", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/hoş geldin|welcome/i)).toBeTruthy();
  });
});
`.trim()
  );

  pkgJson.scripts.test = "jest";
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  // Git init
  console.log("🔧 Git başlatılıyor...");
  execSync("git init", { stdio: "inherit" });
  execSync("git add .", { stdio: "inherit" });
  execSync('git commit -m "Initial commit 🚀"', { stdio: "inherit" });

  console.log(`✅ Proje başarıyla oluşturuldu: ${appName}`);
} catch (err) {
  console.error("❌ Hata oluştu:", err.message);
}
