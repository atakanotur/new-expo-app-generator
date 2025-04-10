const fs = require("fs");
const path = require("path");

function setupComponents() {
  console.log("🧩 Atomic component klasörleri oluşturuluyor...");

  const basePath = path.join("source", "components");

  // Klasörler: atoms / molecules / organisms
  const atomicFolders = ["atoms", "molecules", "organisms"];
  atomicFolders.forEach((folder) => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });

  // ATOMS
  const atoms = {
    "Button.tsx": `
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
`.trim(),

    "Text.tsx": `
import React from "react";
import { Text as RNText, StyleSheet, TextProps as RNTextProps } from "react-native";
import { useTheme } from "@theme";

type Props = RNTextProps & {
  children: React.ReactNode;
};

export default function Text({ children, style, ...rest }: Props) {
  const { theme } = useTheme();

  return (
    <RNText style={[styles.text, { color: theme.colors.text }, style]} {...rest}>
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
`.trim(),

    "Input.tsx": `
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
`.trim(),

    "Spacer.tsx": `
import React from "react";
import { View } from "react-native";

type Props = {
  height?: number;
  width?: number;
};

export default function Spacer({ height = 8, width = 0 }: Props) {
  return <View style={{ height, width }} />;
}
`.trim(),
  };

  for (const [fileName, content] of Object.entries(atoms)) {
    fs.writeFileSync(path.join(basePath, "atoms", fileName), content);
  }

  fs.writeFileSync(
    path.join(basePath, "atoms", "index.ts"),
    `
export { default as Button } from './Button';
export { default as Text } from './Text';
export { default as Input } from './Input';
export { default as Spacer } from './Spacer';
`.trim()
  );

  // MOLECULES
  fs.writeFileSync(
    path.join(basePath, "molecules", "LoginForm.tsx"),
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
    path.join(basePath, "molecules", "index.ts"),
    `export { default as LoginForm } from './LoginForm';`
  );

  // ORGANISMS
  fs.writeFileSync(
    path.join(basePath, "organisms", "Header.tsx"),
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
    path.join(basePath, "organisms", "index.ts"),
    `export { default as Header } from './Header';`
  );

  // ROOT components/index.ts
  fs.writeFileSync(
    path.join(basePath, "index.ts"),
    `
export * from './atoms';
export * from './molecules';
export * from './organisms';
`.trim()
  );
}

module.exports = { setupComponents };