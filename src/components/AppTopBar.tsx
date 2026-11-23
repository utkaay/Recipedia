import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSession } from '../context/SessionContext';
import { colors, spacing } from '../theme/tokens';

type AppTopBarProps = {
  showLogout?: boolean;
  showBack?: boolean;
  onBack?: () => void;
};

export function AppTopBar({ showLogout = false, showBack = false, onBack }: AppTopBarProps) {
  const router = useRouter();
  const { logout } = useSession();

  function signOut() {
    logout();
    router.replace('/login');
  }

  return (
    <View style={styles.bar}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack ?? (() => router.back())}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={25} color={colors.greenDark} />
        </Pressable>
      ) : null}
      <Text style={styles.brand}>Recipedia</Text>
      {showLogout ? (
        <Pressable accessibilityRole="button" onPress={signOut} style={styles.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: colors.greenDark, fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  back: { width: 42, height: 44, justifyContent: 'center' },
  logout: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  logoutText: { color: colors.terracottaDark, fontSize: 14, fontWeight: '600' },
});
