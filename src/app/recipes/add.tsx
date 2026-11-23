import { useRouter } from 'expo-router';
import { AppScreen } from '../../components/AppScreen';
import { AppTopBar } from '../../components/AppTopBar';
import { BottomNavigation } from '../../components/BottomNavigation';
import { FeedbackState } from '../../components/FeedbackState';
import { RecipeForm } from '../../components/RecipeForm';
import { useRecipes } from '../../context/RecipeContext';
import type { RecipeFormOutput } from '../../schemas/recipeSchema';

export default function AddRecipeScreen() {
  const router = useRouter();
  const { status, error, retryLoad, addRecipe, isSaving } = useRecipes();

  async function saveRecipe(draft: RecipeFormOutput) {
    const recipe = await addRecipe(draft);
    router.replace({ pathname: '/recipes/[recipeId]', params: { recipeId: recipe.id } });
  }

  return (
    <>
      <AppScreen bottomSpace>
        <AppTopBar showBack onBack={() => router.replace('/recipes')} />
        {status === 'loading' ? (
          <FeedbackState title="Preparing your recipe form" loading />
        ) : status === 'error' ? (
          <FeedbackState title="Recipes could not be loaded" message={error ?? undefined} actionLabel="Retry" onAction={retryLoad} />
        ) : (
          <RecipeForm
            mode="add"
            saving={isSaving}
            onCancel={() => router.replace('/recipes')}
            onSubmit={saveRecipe}
          />
        )}
      </AppScreen>
      <BottomNavigation />
    </>
  );
}
