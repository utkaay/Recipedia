import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppScreen } from "../components/AppScreen";
import { AppTopBar } from "../components/AppTopBar";
import { BottomNavigation } from "../components/BottomNavigation";
import { FeedbackState } from "../components/FeedbackState";
import { RECIPE_CATEGORIES } from "../data/recipeCategories";
import { useRecipes } from "../context/RecipeContext";
import { useSession } from "../context/SessionContext";
import { useTheme } from "../theme/ThemeContext";
import { corners, spacing } from "../theme/tokens";

const categoryIcons = {
  Breakfast: "sunny-outline",
  Lunch: "leaf-outline",
  Dinner: "restaurant-outline",
  Dessert: "ice-cream-outline",
};

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { account } = useSession();
  const { recipes, status, error, retryLoad } = useRecipes();

  function getCategoryCounts() {
    return RECIPE_CATEGORIES.map((category) => {
      const matchingRecipes = recipes.filter(
        (recipe) => recipe.category === category,
      );
      return {
        category,
        count: matchingRecipes.length,
      };
    });
  }

  const categoryCounts = getCategoryCounts();
  const recipeCount = recipes.length;
  let recipeNoun = "recipes";
  if (recipeCount === 1) {
    recipeNoun = "recipe";
  }
  let greetingName = "cook";
  if (account && account.name !== undefined && account.name !== null) {
    greetingName = account.name;
  }

  function browseRecipes() {
    router.replace("/recipes");
  }

  function openAddRecipe() {
    router.push("/recipes/add");
  }

  let collectionContent;
  if (status === "loading") {
    collectionContent = (
      <FeedbackState
        title = "Loading your recipes"
        message = "Your collection will be ready in a moment."
        loading />
    );
  } else if (status === "error") {
    let errorMessage = error;
    if (errorMessage === undefined || errorMessage === null) {
      errorMessage = "Check your device storage and try again.";
    }
    collectionContent = (
      <FeedbackState
        title = "Recipes could not be loaded"
        message = {errorMessage}
        actionLabel = "Retry"
        onAction = {retryLoad} />
    );
  } else {
    collectionContent = (
      <>
        <Text style = {styles.total} >
          {recipeCount} {recipeNoun} total
        </Text>

        <View style = {styles.categories} >
          {categoryCounts.map((item) => (
            <View key = {item.category} style = {styles.categoryRow} >
              <Ionicons
                name = {categoryIcons[item.category]}
                size = {24}
                color = {colors.terracotta} />
              <Text style = {styles.categoryName} >{item.category}</Text>
              <Text style = {styles.categoryCount} >{item.count}</Text>
            </View>
          ))}
        </View>

        <AppButton
          label = "Browse Recipes"
          onPress = {browseRecipes}
          style = {styles.action} />
        <AppButton
          label = "Add Recipe"
          onPress = {openAddRecipe}
          variant = "outline"
          style = {styles.action} />
      </>
    );
  }

  return (
    <>
      <AppScreen bottomSpace >
        <AppTopBar  />
        <Text style = {styles.greeting} >Hello, {greetingName}!</Text>
        <Text style = {styles.heading} >My Recipes</Text>
        {collectionContent}
      </AppScreen>
      <BottomNavigation  />
    </>
  );
}

export default HomeScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    greeting: {
      color: colors.muted,
      fontSize: 15,
      marginTop: spacing.lg,
    },

    heading: {
      color: colors.greenDark,
      fontSize: 30,
      fontWeight: "800",
      marginTop: spacing.xs,
    },

    total: {
      color: colors.ink,
      fontSize: 17,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },

    categories: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      marginBottom: spacing.lg,
    },

    categoryRow: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    categoryName: {
      flex: 1,
      color: colors.greenDark,
      fontSize: 16,
      fontWeight: "700",
    },

    categoryCount: {
      color: colors.greenDark,
      fontSize: 16,
      fontWeight: "700",
    },

    action: {
      marginTop: spacing.sm,
      borderRadius: corners.pill,
      minHeight: 52,
    },
  });
