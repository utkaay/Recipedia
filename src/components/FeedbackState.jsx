import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import { AppButton } from "./AppButton";

export function FeedbackState({
  title,
  message,
  loading = false,
  actionLabel,
  onAction,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style = {styles.container} >
      {loading ? <ActivityIndicator size = "large" color = {colors.green} /> : null}
      <Text style = {styles.title} >{title}</Text>
      {message ? <Text style = {styles.message} >{message}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton label = {actionLabel} onPress = {onAction} variant = "outline" />
      ) : null}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 220,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },

    title: {
      color: colors.greenDark,
      fontSize: 21,
      fontWeight: "700",
      textAlign: "center",
    },

    message: {
      color: colors.muted,
      fontSize: 15,
      textAlign: "center",
      lineHeight: 22,
      maxWidth: 340,
    },
  });
