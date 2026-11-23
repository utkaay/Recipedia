import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, corners, spacing } from '../theme/tokens';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'text';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'text' ? colors.green : colors.white} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: corners.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.green },
  outline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.green },
  danger: { backgroundColor: colors.terracotta },
  text: { backgroundColor: 'transparent', paddingHorizontal: spacing.sm },
  label: { fontSize: 17, fontWeight: '700' },
  primaryLabel: { color: colors.white },
  outlineLabel: { color: colors.green },
  dangerLabel: { color: colors.white },
  textLabel: { color: colors.green, textDecorationLine: 'underline' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.55 },
});
