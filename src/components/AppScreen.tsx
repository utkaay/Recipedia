import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';

type AppScreenProps = {
  children: ReactNode;
  bottomSpace?: boolean;
  centered?: boolean;
};

export function AppScreen({ children, bottomSpace = false, centered = false }: AppScreenProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            centered && styles.centered,
            bottomSpace && styles.withBottomNavigation,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function PageHeader({ children }: { children: ReactNode }) {
  return <View style={styles.pageHeader}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  centered: { justifyContent: 'center' },
  withBottomNavigation: { paddingBottom: 112 },
  pageHeader: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
