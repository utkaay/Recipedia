import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

export function RecipeCard({ recipe, onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityRole = "button"
      accessibilityLabel = {`${recipe.name}, ${recipe.category}, ${recipe.preparationTime} minutes`}
      onPress = {onPress}
      style = {({ pressed }) => [styles.card, pressed && styles.pressed]} >
      <View style = {styles.copy} >
        <Text style = {styles.name} >{recipe.name}</Text>
        <Text style = {styles.meta} >
          {recipe.category} · {recipe.preparationTime} min
        </Text>
      </View>
      <Ionicons name = "chevron-forward" size = {20} color = {colors.greenDark} />
    </Pressable>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      minHeight: 64,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },

    copy: {
      flex: 1,
      gap: 2,
    },

    name: {
      color: colors.ink,
      fontSize: 16,
      fontWeight: "700",
    },

    meta: {
      color: colors.muted,
      fontSize: 13,
    },

    pressed: {
      opacity: 0.7,
    },
  });
