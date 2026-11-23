import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, corners, spacing } from '../theme/tokens';

type AppTextInputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function AppTextInput({ label, error, style, accessibilityLabel, ...inputProps }: AppTextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={error ? `Error: ${error}` : undefined}
        placeholderTextColor={colors.muted}
        selectionColor={colors.green}
        style={[styles.input, inputProps.multiline && styles.multiline, error && styles.inputError, style]}
        {...inputProps}
      />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { color: colors.greenDark, fontWeight: '700', fontSize: 15, marginBottom: spacing.xs },
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
  multiline: { minHeight: 104, textAlignVertical: 'top' },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 13, marginTop: spacing.xs },
});
