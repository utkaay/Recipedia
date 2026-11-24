import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { AppScreen } from "../../components/AppScreen";
import { AppTopBar } from "../../components/AppTopBar";
import { BottomNavigation } from "../../components/BottomNavigation";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { FeedbackState } from "../../components/FeedbackState";
import { useRecipes } from "../../context/RecipeContext";
import { useTheme } from "../../theme/ThemeContext";
import { corners, spacing } from "../../theme/tokens";

export function RecipeDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId;
  const { recipes, status, error, retryLoad, deleteRecipe, isSaving } =
    useRecipes();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const recipe = recipes.find((item) => item.id === recipeId);

  function goToRecipes() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/recipes");
    }
  }

  function editRecipe() {
    if (!recipe) return;
    router.push({
      pathname: "/recipes/[recipeId]/edit",
      params: { recipeId: recipe.id },
    });
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
    return getRecipeDetails(recipe);
  }

  function getRecipeDetails(currentRecipe) {
    return (
      <>
        <View style = {styles.titleBlock} >
          <View style = {styles.recipeHeading} >
            <Text style = {styles.title} >{currentRecipe.name}</Text>
            <View style = {styles.metaRow} >
              <Text style = {styles.category} >{currentRecipe.category}</Text>
              <View style = {styles.separator} />
              <Text style = {styles.time} >
                {currentRecipe.preparationTime} min
              </Text>
            </View>
          </View>
          <Image
            accessibilityLabel = "A lemon with fresh herbs"
            source = {require("../../../assets/images/recipedia/lemon-herbs.png")}
            resizeMode = "contain"
            style = {styles.lemon} />
        </View>

        <View style = {styles.section} >
          <Text style = {styles.sectionTitle} >
            Ingredients
            </Text>
          {currentRecipe.ingredients.map((ingredient, index) => (
            <View
              key = {`${currentRecipe.id}-ingredient-${index}`}
              style = {styles.listItem} >
              <View style = {styles.bullet} />
              <Text style = {styles.bodyText} >{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style = {styles.section} >
          <Text style = {styles.sectionTitle} >Instructions</Text>
          {currentRecipe.instructions.map((instruction, index) => (
            <View
              key = {`${currentRecipe.id}-step-${index}`}
              style = {styles.stepRow} >
              <View style = {styles.stepNumber} >
                <Text style = {styles.stepNumberText} >{index + 1}</Text>
              </View>
              <Text style = {styles.bodyText} >{instruction}</Text>
            </View>
          ))}
        </View>

        <View style = {styles.actions} >
          <AppButton
            label = "Edit"
            variant = "outline"
            onPress = {editRecipe}
            style = {styles.action} />
          <AppButton
            label = "Delete"
            variant = "danger"
            onPress = {showDeleteConfirmation}
            style = {styles.action} />
        </View>
      </>
    );
  }

  return (
    <>
      <AppScreen bottomSpace >
        <AppTopBar showBack onBack = {goToRecipes} />
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

export default RecipeDetailsScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    titleBlock: {
      minHeight: 118,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },

    recipeHeading: {
      flex: 1,
    },

    title: {
      color: colors.greenDark,
      fontSize: 27,
      lineHeight: 33,
      fontWeight: "800",
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },

    category: {
      color: colors.greenDark,
      fontSize: 14,
      fontWeight: "700",
    },

    separator: {
      width: 1,
      height: 16,
      backgroundColor: colors.border,
    },

    time: {
      color: colors.ink,
      fontSize: 14,
    },

    lemon: {
      width: 104,
      height: 104,
      marginRight: -spacing.sm,
    },

    section: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
      marginTop: spacing.sm,
      paddingBottom: spacing.sm,
    },

    sectionTitle: {
      color: colors.greenDark,
      fontSize: 20,
      fontWeight: "800",
      marginBottom: spacing.sm,
    },

    listItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },

    bullet: {
      width: 7,
      height: 7,
      borderRadius: corners.pill,
      backgroundColor: colors.green,
      marginTop: 7,
    },

    bodyText: {
      flex: 1,
      color: colors.ink,
      fontSize: 15,
      lineHeight: 22,
    },

    stepRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },

    stepNumber: {
      width: 26,
      height: 26,
      borderRadius: corners.pill,
      backgroundColor: colors.greenSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    stepNumberText: {
      color: colors.greenDark,
      fontSize: 14,
      fontWeight: "800",
    },

    actions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },

    action: {
      flex: 1,
      borderRadius: corners.pill,
    },
  });
