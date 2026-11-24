import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { corners, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isDisabled = disabled || loading;
  let buttonAccessibilityLabel = accessibilityLabel;
  if (
    buttonAccessibilityLabel === undefined ||
    buttonAccessibilityLabel === null
  ) {
    buttonAccessibilityLabel = label;
  }

  let buttonContent;
  if (loading) {
    let spinnerColor = colors.white;
    if (variant === "outline" || variant === "text") {
      spinnerColor = colors.green;
    }
    buttonContent = <ActivityIndicator color = {spinnerColor} />;
  } else {
    buttonContent = (
      <Text style = {[styles.label, styles[`${variant}Label`]]} >{label}</Text>
    );
  }

  return (
    <Pressable
      accessibilityRole = "button"
      accessibilityLabel = {buttonAccessibilityLabel}
      accessibilityState = {{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled = {isDisabled}
      onPress = {onPress}
      style = {({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]} >
      {buttonContent}
    </Pressable>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    button: {
      minHeight: 48,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: corners.md,
      alignItems: "center",
      justifyContent: "center",
    },

    primary: {
      backgroundColor: colors.green,
    },

    outline: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.green,
    },

    danger: {
      backgroundColor: colors.terracotta,
    },

    text: {
      backgroundColor: "transparent",
      paddingHorizontal: spacing.sm,
    },

    label: {
      fontSize: 17,
      fontWeight: "700",
    },

    primaryLabel: {
      color: colors.white,
    },

    outlineLabel: {
      color: colors.green,
    },

    dangerLabel: {
      color: colors.white,
    },

    textLabel: {
      color: colors.green,
      textDecorationLine: "underline",
    },

    pressed: {
      opacity: 0.8,
    },

    disabled: {
      opacity: 0.55,
    },
  });
