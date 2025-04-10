const fs = require("fs");
const path = require("path");

function setupHomeScreen() {
  console.log("📄 HomeScreen.tsx yazılıyor...");

  const screenPath = path.join("source", "screens");
  fs.mkdirSync(screenPath, { recursive: true });

  fs.writeFileSync(
    path.join(screenPath, "HomeScreen.tsx"),
    `
import { View } from 'react-native';
import { Text, Button } from "@components";
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
}

module.exports = { setupHomeScreen };
