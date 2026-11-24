import { useRouter } from "expo-router";

import { AppScreen } from "../../components/AppScreen";
import { AppTopBar } from "../../components/AppTopBar";
import { BottomNavigation } from "../../components/BottomNavigation";
import { FeedbackState } from "../../components/FeedbackState";
import { RecipeForm } from "../../components/RecipeForm";
import { useRecipes } from "../../context/RecipeContext";

export function AddRecipeScreen() {
  const router = useRouter();
  const { status, error, retryLoad, addRecipe, isSaving } = useRecipes();

  async function saveRecipe(draft) {
    const savedRecipe = await addRecipe(draft);
    router.replace({
      pathname: "/recipes/[recipeId]",
      params: { recipeId: savedRecipe.id },
    });
  }

  function cancelAdd() {
    router.replace("/recipes");
  }

  function goToRecipes() {
    router.replace("/recipes");
  }

  let loadErrorMessage;
  if (error !== undefined && error !== null) {
    loadErrorMessage = error;
  }

  let formContent;
  if (status === "loading") {
    formContent = <FeedbackState title = "Preparing your recipe form" loading />;
  } else if (status === "error") {
    formContent = (
      <FeedbackState
        title = "Recipes could not be loaded"
        message = {loadErrorMessage}
        actionLabel = "Retry"
        onAction = {retryLoad} />
    );
  } else {
    formContent = (
      <RecipeForm
        mode = "add"
        saving = {isSaving}
        onCancel = {cancelAdd}
        onSubmit = {saveRecipe} />
    );
  }

  return (
    <>
      <AppScreen bottomSpace >
        <AppTopBar showBack onBack = {goToRecipes} />
        {formContent}
      </AppScreen>
      <BottomNavigation  />
    </>
  );
}

export default AddRecipeScreen;
