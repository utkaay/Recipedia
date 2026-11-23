import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '../../../components/AppScreen';
import { AppTopBar } from '../../../components/AppTopBar';
import { BottomNavigation } from '../../../components/BottomNavigation';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { FeedbackState } from '../../../components/FeedbackState';
import { RecipeForm } from '../../../components/RecipeForm';
import { useRecipes } from '../../../context/RecipeContext';
import type { RecipeFormOutput } from '../../../schemas/recipeSchema';

export default function EditRecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const recipeId = Array.isArray(params.recipeId) ? params.recipeId[0] : params.recipeId;
  const { recipes, status, error, retryLoad, updateRecipe, deleteRecipe, isSaving } = useRecipes();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const recipe = recipes.find((item) => item.id === recipeId);

  async function saveChanges(draft: RecipeFormOutput) {
    if (!recipeId) throw new Error('Recipe not found.');
    await updateRecipe(recipeId, draft);
    router.replace({ pathname: '/recipes/[recipeId]', params: { recipeId } });
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

  return (
    <>
      <AppScreen bottomSpace>
        <AppTopBar showBack onBack={() => recipeId
          ? router.replace({ pathname: '/recipes/[recipeId]', params: { recipeId } })
          : router.replace('/recipes')} />
        {status === 'loading' ? (
          <FeedbackState title="Loading recipe" loading />
        ) : status === 'error' ? (
          <FeedbackState title="Recipes could not be loaded" message={error ?? undefined} actionLabel="Retry" onAction={retryLoad} />
        ) : !recipe ? (
          <FeedbackState title="Recipe not found" message="It may have been deleted or is no longer in this account’s collection." actionLabel="Back to Recipes" onAction={() => router.replace('/recipes')} />
        ) : (
          <RecipeForm
            mode="edit"
            initialRecipe={recipe}
            saving={isSaving}
            onCancel={() => router.replace({ pathname: '/recipes/[recipeId]', params: { recipeId: recipe.id } })}
            onSubmit={saveChanges}
            onDelete={() => { setDeleteError(''); setConfirmDelete(true); }}
            deleting={confirmDelete && isSaving}
          />
        )}
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
