import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../theme/ThemeContext";

export function AppTopBar({ showBack = false, onBack }) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  function goBack() {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  }

  let backButton;
  if (showBack) {
    backButton = (
      <Pressable
        accessibilityRole = "button"
        accessibilityLabel = "Go back"
        onPress = {goBack}
        style = {styles.back} >
        <Ionicons name = "chevron-back" size = {25} color = {colors.greenDark} />
      </Pressable>
    );
  }

  return (
    <View style = {styles.bar} >
      {backButton}
      <Text style = {styles.brand} >Recipedia</Text>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    bar: {
      minHeight: 46,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    brand: {
      color: colors.greenDark,
      fontSize: 21,
      fontWeight: "800",
      letterSpacing: -0.4,
    },

    back: {
      width: 42,
      height: 44,
      justifyContent: "center",
    },
  });
