#!/usr/bin/env node

const { initProject } = require("./scripts/initProject");
const { installPackages } = require("./scripts/installPackages");
const { setupFolders } = require("./scripts/setupFolders");
const { setupTheme } = require("./scripts/setupTheme");
const { setupComponents } = require("./scripts/setupComponents");
const { setupTesting } = require("./scripts/setupTesting");
const { setupStore } = require("./scripts/setupStore");
const { setupI18n } = require("./scripts/setupI18n");
const { setupHomeScreen } = require("./scripts/setupHomeScreen");
const { setupTsconfig } = require("./scripts/setupTsconfig");
const { setupBabel } = require("./scripts/setupBabel");
const { setupEnvJsonGit } = require("./scripts/setupEnvJsonGit");

const appName = process.argv[2];

if (!appName) {
  console.error("⚠️  Lütfen bir proje adı gir:");
  console.error("Kullanım: node create-rn-app.js myApp");
  process.exit(1);
}

(async () => {
  try {
    await initProject(appName);
    await installPackages();
    await setupFolders();
    await setupTheme();
    await setupComponents();
    await setupTesting();
    await setupStore();
    await setupI18n(appName);
    await setupHomeScreen();
    await setupTsconfig();
    await setupBabel();
    await setupEnvJsonGit(appName);

    console.log(`✅ Proje başarıyla oluşturuldu: ${appName}`);
  } catch (err) {
    console.error("❌ Hata oluştu:", err.message);
  }
})();
