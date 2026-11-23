import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppScreen } from '../../components/AppScreen';
import { AppTopBar } from '../../components/AppTopBar';
import { BottomNavigation } from '../../components/BottomNavigation';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FeedbackState } from '../../components/FeedbackState';
import { useRecipes } from '../../context/RecipeContext';
import { colors, corners, spacing } from '../../theme/tokens';

export default function RecipeDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const recipeId = Array.isArray(params.recipeId) ? params.recipeId[0] : params.recipeId;
  const { recipes, status, error, retryLoad, deleteRecipe, isSaving } = useRecipes();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const recipe = recipes.find((item) => item.id === recipeId);

  function goToRecipes() {
    if (router.canGoBack()) router.back();
    else router.replace('/recipes');
  }

  async function confirmRemoval() {
    if (!recipeId || isSaving) return;
    setDeleteError('');
    try {
      await deleteRecipe(recipeId);
      setConfirmDelete(false);
      router.replace('/recipes');
    } catch (deleteFailure) {
      setDeleteError(deleteFailure instanceof Error ? deleteFailure.message : 'The recipe could not be deleted. Try again.');
    }
  }

  let content;
  if (status === 'loading') {
    content = <FeedbackState title="Loading recipe" loading />;
  } else if (status === 'error') {
    content = <FeedbackState title="Recipes could not be loaded" message={error ?? undefined} actionLabel="Retry" onAction={retryLoad} />;
  } else if (!recipe) {
    content = <FeedbackState title="Recipe not found" message="It may have been deleted or is no longer in this account's collection." actionLabel="Back to Recipes" onAction={() => router.replace('/recipes')} />;
  } else {
    content = (
      <>
        <View style={styles.titleBlock}>
          <View style={styles.recipeHeading}>
            <Text style={styles.title}>{recipe.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.category}>{recipe.category}</Text>
              <View style={styles.separator} />
              <Text style={styles.time}>{recipe.preparationTime} min</Text>
            </View>
          </View>
          <Image
            accessibilityLabel="A lemon with fresh herbs"
            source={require('../../../assets/images/recipedia/lemon-herbs.png')}
            resizeMode="contain"
            style={styles.lemon}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={`${recipe.id}-ingredient-${index}`} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.bodyText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={`${recipe.id}-step-${index}`} style={styles.stepRow}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
              <Text style={styles.bodyText}>{instruction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <AppButton label="Edit" variant="outline" onPress={() => router.push({ pathname: '/recipes/[recipeId]/edit', params: { recipeId: recipe.id } })} style={styles.action} />
          <AppButton label="Delete" variant="danger" onPress={() => { setDeleteError(''); setConfirmDelete(true); }} style={styles.action} />
        </View>
      </>
    );
  }

  return (
    <>
      <AppScreen bottomSpace>
        <AppTopBar showBack onBack={goToRecipes} />
        {content}
      </AppScreen>
      <BottomNavigation />
      <ConfirmDialog
        visible={confirmDelete}
        title="Delete this recipe?"
        message={deleteError || 'This recipe will be removed from your collection.'}
        confirmLabel="Delete"
        busy={isSaving}
        onCancel={() => { if (!isSaving) setConfirmDelete(false); }}
        onConfirm={confirmRemoval}
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleBlock: { minHeight: 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  recipeHeading: { flex: 1 },
  title: { color: colors.greenDark, fontSize: 27, lineHeight: 33, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  category: { color: colors.greenDark, fontSize: 14, fontWeight: '700' },
  separator: { width: 1, height: 16, backgroundColor: colors.border },
  time: { color: colors.ink, fontSize: 14 },
  lemon: { width: 104, height: 104, marginRight: -spacing.sm },
  section: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.sm, paddingBottom: spacing.sm },
  sectionTitle: { color: colors.greenDark, fontSize: 20, fontWeight: '800', marginBottom: spacing.sm },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
  bullet: { width: 7, height: 7, borderRadius: corners.pill, backgroundColor: colors.green, marginTop: 7 },
  bodyText: { flex: 1, color: colors.ink, fontSize: 15, lineHeight: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  stepNumber: { width: 26, height: 26, borderRadius: corners.pill, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: colors.greenDark, fontSize: 14, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.lg },
  action: { flex: 1, borderRadius: corners.pill },
});
