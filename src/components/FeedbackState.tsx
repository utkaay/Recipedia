import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { AppButton } from './AppButton';

type FeedbackStateProps = {
  title: string;
  message?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export function FeedbackState({
  title,
  message,
  loading = false,
  actionLabel,
  onAction,
}: FeedbackStateProps) {
  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color={colors.green} /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} variant="outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  title: { color: colors.greenDark, fontSize: 21, fontWeight: '700', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 15, textAlign: 'center', lineHeight: 22, maxWidth: 340 },
});
