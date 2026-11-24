import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppScreen } from "../../../components/AppScreen";
import { AppTopBar } from "../../../components/AppTopBar";
import { BottomNavigation } from "../../../components/BottomNavigation";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { FeedbackState } from "../../../components/FeedbackState";
import { RecipeForm } from "../../../components/RecipeForm";
import { useRecipes } from "../../../context/RecipeContext";

export function EditRecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId;
  const {
    recipes,
    status,
    error,
    retryLoad,
    updateRecipe,
    deleteRecipe,
    isSaving,
  } = useRecipes();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const recipe = recipes.find((item) => item.id === recipeId);

  async function saveChanges(draft) {
    if (!recipeId) {
      throw new Error("Recipe not found.");
    }
    await updateRecipe(recipeId, draft);
    router.replace({
      pathname: "/recipes/[recipeId]",
      params: { recipeId },
    });
  }

  function cancelEdit() {
    if (!recipe) {
      router.replace("/recipes");
      return;
    }
    router.replace({
      pathname: "/recipes/[recipeId]",
      params: { recipeId: recipe.id },
    });
  }

  function goBack() {
    cancelEdit();
  }

  function showDeleteConfirmation() {
    setDeleteError("");
    setConfirmDelete(true);
  }

  function cancelDelete() {
    if (!isSaving) {
      setConfirmDelete(false);
    }
  }

  async function confirmRemoval() {
    if (!recipeId || isSaving) return;
    setDeleteError("");
    try {
      await deleteRecipe(recipeId);
      setConfirmDelete(false);
      router.replace("/recipes");
    } catch (deleteFailure) {
      const message =
        deleteFailure instanceof Error
          ? deleteFailure.message
          : "The recipe could not be deleted. Try again.";
      setDeleteError(message);
    }
  }

  function getScreenContent() {
    if (status === "loading") {
      return <FeedbackState title = "Loading recipe" loading />;
    }
    if (status === "error") {
      return (
        <FeedbackState
          title = "Recipes could not be loaded"
          message = {error ?? undefined}
          actionLabel = "Retry"
          onAction = {retryLoad} />
      );
    }
    if (!recipe) {
      return (
        <FeedbackState
          title = "Recipe not found"
          message = "It may have been deleted or is no longer in this account's collection."
          actionLabel = "Back to Recipes"
          onAction = {() => router.replace("/recipes")} />
      );
    }
    return (
      <RecipeForm
        mode = "edit"
        initialRecipe = {recipe}
        saving = {isSaving}
        onCancel = {cancelEdit}
        onSubmit = {saveChanges}
        onDelete = {showDeleteConfirmation}
        deleting = {confirmDelete && isSaving} />
    );
  }

  return (
    <>
      <AppScreen bottomSpace >
        <AppTopBar showBack onBack = {goBack} />
        {getScreenContent()}
      </AppScreen>
      <BottomNavigation  />
      <ConfirmDialog
        visible = {confirmDelete}
        title = "Delete this recipe?"
        message = {
          deleteError || "This recipe will be removed from your collection."
        }
        confirmLabel = "Delete"
        busy = {isSaving}
        onCancel = {cancelDelete}
        onConfirm = {confirmRemoval} />
    </>
  );
}

export default EditRecipeScreen;
