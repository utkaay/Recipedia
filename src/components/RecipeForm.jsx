import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "./AppButton";
import { AppTextInput } from "./AppTextInput";
import { CategoryPicker } from "./CategorySelector";
import { recipeFormSchema } from "../schemas/recipeSchema";
import { useTheme } from "../theme/ThemeContext";
import { spacing } from "../theme/tokens";

function toFormInput(recipe) {
  if (!recipe) {
    return {
      name: "",
      category: "",
      preparationTime: "",
      ingredients: "",
      instructions: "",
    };
  }
  return {
    name: recipe.name,
    category: recipe.category,
    preparationTime: String(recipe.preparationTime),
    ingredients: recipe.ingredients.join("\n"),
    instructions: recipe.instructions.join("\n"),
  };
}

export function RecipeForm({
  mode,
  initialRecipe,
  saving = false,
  onCancel,
  onSubmit,
  onDelete,
  deleting = false,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [values, setValues] = useState(() => toFormInput(initialRecipe));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const isAddMode = mode === "add";
  let heading = "Edit Recipe";
  let subtitle = "Update your recipe details.";
  let submitLabel = "Save Changes";
  if (isAddMode) {
    heading = "Add Recipe";
    subtitle = "Save a new recipe to your collection.";
    submitLabel = "Save Recipe";
  }

  function updateValue(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setSubmitError("");
  }

  function updateName(value) {
    updateValue("name", value);
  }

  function updateCategory(category) {
    updateValue("category", category);
  }

  function updatePreparationTime(value) {
    updateValue("preparationTime", value);
  }

  function updateIngredients(value) {
    updateValue("ingredients", value);
  }

  function updateInstructions(value) {
    updateValue("instructions", value);
  }

  async function submitRecipe() {
    if (saving || deleting) return;
    setSubmitError("");
    const result = recipeFormSchema.safeParse(values);
    if (!result.success) {
      const nextErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    try {
      await onSubmit(result.data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The recipe could not be saved. Try again.",
      );
    }
  }

  return (
    <View>
      <Text style = {styles.heading} >{heading}</Text>
      <Text style = {styles.subtitle} >{subtitle}</Text>

      <AppTextInput
        label = "Name"
        placeholder = "e.g., Vegetable Pasta"
        value = {values.name}
        onChangeText = {updateName}
        error = {errors.name}
        returnKeyType = "next"
        maxLength = {100} />

      <CategoryPicker
        selected = {values.category}
        onSelect = {updateCategory}
        error = {errors.category} />

      <AppTextInput
        label = "Preparation Time (minutes)"
        placeholder = "e.g., 25"
        value = {values.preparationTime}
        onChangeText = {updatePreparationTime}
        error = {errors.preparationTime}
        keyboardType = "number-pad"
        returnKeyType = "next"
        maxLength = {5} />

      <AppTextInput
        label = "Ingredients"
        placeholder = "Enter ingredients, one per line"
        value = {values.ingredients}
        onChangeText = {updateIngredients}
        error = {errors.ingredients}
        multiline
        textAlignVertical = "top" />

      <AppTextInput
        label = "Instructions"
        placeholder = "Enter step-by-step instructions, one per line"
        value = {values.instructions}
        onChangeText = {updateInstructions}
        error = {errors.instructions}
        multiline
        textAlignVertical = "top" />

      {submitError ? (
        <Text accessibilityRole = "alert" style = {styles.submitError} >
          {submitError}
        </Text>
      ) : null}

      <View style = {styles.actions} >
        <AppButton
          label = "Cancel"
          onPress = {onCancel}
          variant = "outline"
          style = {styles.action} />
        <AppButton
          label = {submitLabel}
          onPress = {submitRecipe}
          loading = {saving}
          disabled = {deleting}
          style = {styles.action} />
      </View>

      {onDelete ? (
        <AppButton
          label = "Delete Recipe"
          onPress = {onDelete}
          variant = "danger"
          disabled = {saving}
          loading = {deleting}
          style = {styles.deleteButton} />
      ) : null}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    heading: {
      color: colors.greenDark,
      fontSize: 27,
      fontWeight: "800",
      marginTop: spacing.sm,
    },

    subtitle: {
      color: colors.muted,
      fontSize: 14,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },

    actions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },

    action: {
      flex: 1,
    },

    deleteButton: {
      marginTop: spacing.sm,
    },

    submitError: {
      color: colors.error,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
  });
