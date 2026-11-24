import { StyleSheet, Text, TextInput, View } from "react-native";

import { corners, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

export function AppTextInput({
  label,
  error,
  style,
  accessibilityLabel,
  ...inputProps
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const inputStyles = [
    styles.input,
    inputProps.multiline && styles.multiline,
    error && styles.inputError,
    style,
  ];
  let inputAccessibilityLabel = accessibilityLabel;
  if (
    inputAccessibilityLabel === undefined ||
    inputAccessibilityLabel === null
  ) {
    inputAccessibilityLabel = label;
  }

  let inputAccessibilityHint;
  if (error) {
    inputAccessibilityHint = `Error: ${error}`;
  }

  let errorMessage;
  if (error) {
    errorMessage = (
      <Text accessibilityRole = "alert" style = {styles.error} >
        {error}
      </Text>
    );
  }

  return (
    <View style = {styles.field} >
      <Text style = {styles.label} >{label}</Text>
      <TextInput
        accessibilityLabel = {inputAccessibilityLabel}
        accessibilityHint = {inputAccessibilityHint}
        placeholderTextColor = {colors.muted}
        selectionColor = {colors.green}
        style = {inputStyles}
        {...inputProps} />
      {errorMessage}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    field: {
      marginBottom: spacing.md,
    },

    label: {
      color: colors.greenDark,
      fontWeight: "700",
      fontSize: 15,
      marginBottom: spacing.xs,
    },

    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: corners.sm,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: colors.ink,
      fontSize: 16,
    },

    multiline: {
      minHeight: 104,
      textAlignVertical: "top",
    },

    inputError: {
      borderColor: colors.error,
    },

    error: {
      color: colors.error,
      fontSize: 13,
      marginTop: spacing.xs,
    },
  });
