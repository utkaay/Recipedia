import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { corners, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import { AppButton } from "./AppButton";

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  busy = false,
  onCancel,
  onConfirm,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      transparent
      animationType = "fade"
      visible = {visible}
      onRequestClose = {onCancel} >
      <View style = {styles.overlay} >
        <Pressable
          accessibilityRole = "button"
          accessibilityLabel = "Close confirmation"
          onPress = {onCancel}
          style = {StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style = {styles.dialog} >
          <Text style = {styles.title} >{title}</Text>
          <Text style = {styles.message} >{message}</Text>
          <View style = {styles.actions} >
            <AppButton
              label = "Cancel"
              onPress = {onCancel}
              variant = "outline"
              style = {styles.action} />
            <AppButton
              label = {confirmLabel}
              onPress = {onConfirm}
              variant = "danger"
              loading = {busy}
              style = {styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(25, 35, 20, 0.45)",
      justifyContent: "center",
      padding: spacing.lg,
    },

    dialog: {
      backgroundColor: colors.background,
      borderRadius: corners.lg,
      padding: spacing.lg,
      gap: spacing.md,
    },

    title: {
      color: colors.greenDark,
      fontSize: 21,
      fontWeight: "800",
    },

    message: {
      color: colors.ink,
      fontSize: 15,
      lineHeight: 22,
    },

    actions: {
      flexDirection: "row",
      gap: spacing.sm,
    },

    action: {
      flex: 1,
    },
  });
