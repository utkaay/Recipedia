import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { AppTopBar } from '../components/AppTopBar';
import { BottomNavigation } from '../components/BottomNavigation';
import { FeedbackState } from '../components/FeedbackState';
import { useRecipes } from '../context/RecipeContext';
import { useSession } from '../context/SessionContext';
import { colors, corners, spacing } from '../theme/tokens';
import { RECIPE_CATEGORIES, type RecipeCategory } from '../types/recipe';

const categoryIcons: Record<RecipeCategory, keyof typeof Ionicons.glyphMap> = {
  Breakfast: 'sunny-outline',
  Lunch: 'leaf-outline',
  Dinner: 'restaurant-outline',
  Dessert: 'ice-cream-outline',
};

export default function HomeScreen() {
  const router = useRouter();
  const { account } = useSession();
  const { recipes, status, error, retryLoad } = useRecipes();

  const countByCategory = RECIPE_CATEGORIES.map((category) => ({
    category,
    count: recipes.filter((recipe) => recipe.category === category).length,
  }));

  return (
    <>
      <AppScreen bottomSpace>
        <AppTopBar showLogout />
        <Text style={styles.greeting}>Hello, {account?.name ?? 'cook'}!</Text>
        <Text style={styles.heading}>My Recipes</Text>

        {status === 'loading' ? (
          <FeedbackState title="Loading your recipes" loading message="Your collection will be ready in a moment." />
        ) : status === 'error' ? (
          <FeedbackState title="Recipes could not be loaded" message={error ?? 'Check your device storage and try again.'} actionLabel="Retry" onAction={retryLoad} />
        ) : (
          <>
            <Text style={styles.total}>{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} total</Text>
            <View style={styles.categories}>
              {countByCategory.map(({ category, count }) => (
                <View key={category} style={styles.categoryRow}>
                  <Ionicons name={categoryIcons[category]} size={24} color={colors.terracotta} />
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>{count}</Text>
                </View>
              ))}
            </View>
            <AppButton label="Browse Recipes" onPress={() => router.replace('/recipes')} style={styles.action} />
            <AppButton label="Add Recipe" onPress={() => router.push('/recipes/add')} variant="outline" style={styles.action} />
          </>
        )}
      </AppScreen>
      <BottomNavigation />
    </>
  );
}

const styles = StyleSheet.create({
  greeting: { color: colors.muted, fontSize: 15, marginTop: spacing.lg },
  heading: { color: colors.greenDark, fontSize: 30, fontWeight: '800', marginTop: spacing.xs },
  total: { color: colors.ink, fontSize: 17, marginTop: spacing.sm, marginBottom: spacing.md },
  categories: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, marginBottom: spacing.lg },
  categoryRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  categoryName: { flex: 1, color: colors.greenDark, fontSize: 16, fontWeight: '700' },
  categoryCount: { color: colors.greenDark, fontSize: 16, fontWeight: '700' },
  action: { marginTop: spacing.sm, borderRadius: corners.pill, minHeight: 52 },
});
