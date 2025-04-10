const fs = require("fs");
const path = require("path");

function setupStore() {
  console.log("🧠 Zustand store oluşturuluyor...");

  const storeDir = path.join("source", "store");
  fs.mkdirSync(storeDir, { recursive: true });

  fs.writeFileSync(
    path.join(storeDir, "useAppStore.ts"),
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
}

module.exports = { setupStore };