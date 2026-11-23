import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../context/SessionContext';
import { colors, spacing } from '../theme/tokens';

const navigationItems = [
  { label: 'Home', icon: 'home-outline' as const, route: '/home' as const },
  { label: 'Recipes', icon: 'book-outline' as const, route: '/recipes' as const },
  { label: 'Add', icon: 'add-circle-outline' as const, route: '/recipes/add' as const },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { logout } = useSession();

  function signOut() {
    logout();
    router.replace('/login');
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottom, spacing.sm) }]}>
      {navigationItems.map((item) => {
        const selected = item.label === 'Home'
          ? pathname === '/home'
          : item.label === 'Recipes'
            ? pathname.startsWith('/recipes') && pathname !== '/recipes/add'
            : pathname === '/recipes/add';
        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected }}
            onPress={() => router.replace(item.route)}
            style={styles.item}
          >
            <Ionicons name={item.icon} size={23} color={selected ? colors.greenDark : colors.green} />
            <Text style={[styles.label, selected && styles.selectedLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        onPress={signOut}
        style={styles.item}
      >
        <Ionicons name="log-out-outline" size={23} color={colors.green} />
        <Text style={styles.label}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 64,
    backgroundColor: colors.surfaceGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  item: { alignItems: 'center', justifyContent: 'center', minHeight: 48, minWidth: 62, gap: 1 },
  label: { color: colors.greenDark, fontSize: 11, fontWeight: '600' },
  selectedLabel: { fontWeight: '800' },
});
