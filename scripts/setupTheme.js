const fs = require("fs");
const path = require("path");

function setupTheme() {
  console.log("🎨 Theme sistemi kuruluyor...");

  const themeDir = path.join("source", "theme");
  fs.mkdirSync(themeDir, { recursive: true });

  const files = {
    "light.ts": `
export const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#007AFF",
    secondary: "#5856D6",
  },
};
`.trim(),

    "dark.ts": `
export const darkTheme = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#0A84FF",
    secondary: "#5E5CE6",
  },
};
`.trim(),

    "spacing.ts": `
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
`.trim(),

    "typography.ts": `
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
`.trim(),

    "ThemeProvider.tsx": `
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
`.trim(),

    "useTheme.ts": `
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

export const useTheme = () => useContext(ThemeContext);
`.trim(),

    "index.ts": `
export * from "./light";
export * from "./dark";
export * from "./spacing";
export * from "./typography";
export * from "./ThemeProvider";
export * from "./useTheme";
`.trim(),
  };

  for (const [fileName, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(themeDir, fileName), content);
  }
}

module.exports = { setupTheme };