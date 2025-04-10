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

  //components
  console.log(
    "📁 Atomic Design yapısına uygun component klasörleri oluşturuluyor..."
  );

  const atomicFolders = ["atoms", "molecules", "organisms"];
  atomicFolders.forEach((folder) => {
    fs.mkdirSync(path.join("source", "components", folder), {
      recursive: true,
    });
  });
  //button
  fs.writeFileSync(
    "source/components/atoms/Button.tsx",
    `
  import React from "react";
  import { TouchableOpacity, Text, StyleSheet } from "react-native";
  import { useTheme } from "@theme";
  
  type Props = {
    label: string;
    onPress: () => void;
  };
  
  export default function Button({ label, onPress }: Props) {
    const { theme, toggleTheme } = useTheme();
  
    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onPress}
        onLongPress={toggleTheme}
      >
        <Text style={[styles.text, { color: theme.colors.text }]}>{label}</Text>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      margin: 8,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
    },
  });
  `.trim()
  );

  //text
  fs.writeFileSync(
    "source/components/atoms/Text.tsx",
    `
  import React from "react";
  import { Text as RNText, StyleSheet, TextProps as RNTextProps } from "react-native";
  import { useTheme } from "@theme";
  
  type Props = RNTextProps & {
    children: React.ReactNode;
  };
  
  export default function Text({ children, style, ...rest }: Props) {
    const { theme } = useTheme();
  
    return (
      <RNText
        style={[styles.text, { color: theme.colors.text }, style]}
        {...rest}
      >
        {children}
      </RNText>
    );
  }
  
  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
      fontFamily: "System",
    },
  });
  `.trim()
  );

  //input
  fs.writeFileSync(
    "source/components/atoms/Input.tsx",
    `
  import React from "react";
  import { TextInput, StyleSheet, TextInputProps } from "react-native";
  import { useTheme } from "@theme";
  
  export default function Input(props: TextInputProps) {
    const { theme } = useTheme();
  
    return (
      <TextInput
        placeholderTextColor={theme.colors.text + "88"}
        style={[styles.input, {
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          borderColor: theme.colors.primary,
        }]}
        {...props}
      />
    );
  }
  
  const styles = StyleSheet.create({
    input: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 16,
      marginVertical: 8,
    },
  });
  `.trim()
  );

  //spacer
  fs.writeFileSync(
    "source/components/atoms/Spacer.tsx",
    `
  import React from "react";
  import { View } from "react-native";
  
  type Props = {
    height?: number;
    width?: number;
  };
  
  export default function Spacer({ height = 8, width = 0 }: Props) {
    return <View style={{ height, width }} />;
  }
  `.trim()
  );

  fs.writeFileSync(
    "source/components/atoms/index.ts",
    `
  export { default as Button } from './Button';
  export { default as Text } from './Text';
  export { default as Input } from './Input';
  export { default as Spacer } from './Spacer';
  `.trim()
  );

  //molecules

  //loginform
  fs.writeFileSync(
    "source/components/molecules/LoginForm.tsx",
    `
  import React, { useState } from "react";
  import { View } from "react-native";
  import { Input, Button, Text, Spacer } from "@components";
  
  type Props = {
    onLogin: (email: string, password: string) => void;
  };
  
  export default function LoginForm({ onLogin }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    return (
      <View>
        <Text>Email</Text>
        <Input value={email} onChangeText={setEmail} placeholder="Enter email" />
        <Spacer height={12} />
        <Text>Password</Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />
        <Spacer height={16} />
        <Button label="Login" onPress={() => onLogin(email, password)} />
      </View>
    );
  }
  `.trim()
  );

  fs.writeFileSync(
    "source/components/molecules/index.ts",
    `export { default as LoginForm } from './LoginForm';`
  );

  //organisms

  //header
  fs.writeFileSync(
    "source/components/organisms/Header.tsx",
    `
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Spacer } from "@components";
import { useTheme } from "@theme";

type Props = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <>
          <Spacer height={4} />
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            {subtitle}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
});
`.trim()
  );

  fs.writeFileSync(
    "source/components/organisms/index.ts",
    `export { default as Header } from './Header';`
  );

  fs.writeFileSync(
    "source/components/index.ts",
    `
  export * from './atoms';
  export * from './molecules';
  export * from './organisms';
  `.trim()
  );

  // constants/colors
  fs.mkdirSync("source/constants", { recursive: true });
  fs.writeFileSync(
    "source/constants/colors.ts",
    `
const colors = {
  primary: "#007AFF",
  secondary: "#5856D6",
  background: "#FFFFFF",
  text: "#000000",
  muted: "#6e6e6e",
};

export default colors;
`.trim()
  );

  //theme
  console.log("🎨 Theme sistemi kuruluyor...");

  const themeDir = path.join("source", "theme");
  fs.mkdirSync(themeDir, { recursive: true });

  // light.ts
  fs.writeFileSync(
    path.join(themeDir, "light.ts"),
    `
export const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#007AFF",
    secondary: "#5856D6",
  },
};
`.trim()
  );

  // dark.ts
  fs.writeFileSync(
    path.join(themeDir, "dark.ts"),
    `
export const darkTheme = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#0A84FF",
    secondary: "#5E5CE6",
  },
};
`.trim()
  );

  // spacing.ts
  fs.writeFileSync(
    path.join(themeDir, "spacing.ts"),
    `
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
`.trim()
  );

  // typography.ts
  fs.writeFileSync(
    path.join(themeDir, "typography.ts"),
    `
export const typography = {
  fontFamily: "System",
  fontSize: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  fontWeight: {
    regular: "400",
    bold: "700",
  },
};
`.trim()
  );

  // ThemeProvider.tsx
  fs.writeFileSync(
    path.join(themeDir, "ThemeProvider.tsx"),
    `
import React, { createContext, useContext, useState, ReactNode } from "react";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
`.trim()
  );

  // useTheme.ts
  fs.writeFileSync(
    path.join(themeDir, "useTheme.ts"),
    `
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

export const useTheme = () => useContext(ThemeContext);
`.trim()
  );

  // index.ts
  fs.writeFileSync(
    path.join(themeDir, "index.ts"),
    `
export * from "./light";
export * from "./dark";
export * from "./spacing";
export * from "./typography";
export * from "./ThemeProvider";
export * from "./useTheme";
`.trim()
  );

  // app/+layout.tsx güncelle
  fs.writeFileSync(
    "app/+layout.tsx",
    `
  import { Slot } from 'expo-router';
  import { SafeAreaProvider } from 'react-native-safe-area-context';
  import { ThemeProvider } from '@theme';
  
  export default function Layout() {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
  `.trim()
  );

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

  //app/+layout.tsx güncelle
  fs.writeFileSync(
    "app/+layout.tsx",
    `
  import { Slot } from 'expo-router';
  import { SafeAreaProvider } from 'react-native-safe-area-context';
  import { ThemeProvider } from '@theme';
  
  export default function Layout() {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
  `.trim()
  );

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
