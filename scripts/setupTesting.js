const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

async function setupTesting() {
  console.log("🧪 Test ortamı kuruluyor (Jest + Testing Library)...");

  // Bağımlılıkları yükle
  execSync(
    `npm install --save-dev jest jest-expo @testing-library/react-native@13.1.0 @testing-library/jest-native @types/jest ts-jest`,
    { stdio: "inherit" }
  );

  // jest.config.js
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

  // İlk test dosyası
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

  // package.json test script
  const pkgJsonPath = "package.json";
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  pkgJson.scripts = pkgJson.scripts || {};
  pkgJson.scripts.test = "jest";
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}

module.exports = { setupTesting };