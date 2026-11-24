import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppScreen } from "../components/AppScreen";
import { AppTextInput } from "../components/AppTextInput";
import { AppTopBar } from "../components/AppTopBar";
import { BottomNavigation } from "../components/BottomNavigation";
import { CategorySelector } from "../components/CategorySelector";
import { FeedbackState } from "../components/FeedbackState";
import { RecipeCard } from "../components/RecipeCard";
import { useRecipes } from "../context/RecipeContext";
import { useTheme } from "../theme/ThemeContext";
import { spacing } from "../theme/tokens";

export function RecipesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { recipes, status, error, retryLoad } = useRecipes();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const filteredRecipes = useMemo(
    () => getVisibleRecipes(recipes, search, category),
    [recipes, search, category],
  );
  const hasFilters = search.trim().length > 0 || category !== "All";

  function clearFilters() {
    setSearch("");
    setCategory("All");
  }

  function openAddRecipe() {
    router.push("/recipes/add");
  }

  function openRecipe(recipeId) {
    router.push({
      pathname: "/recipes/[recipeId]",
      params: { recipeId },
    });
  }

  function getCollectionContent() {
    if (status === "loading") {
      return <FeedbackState title = "Loading your recipes" loading />;
    }
    if (status === "error") {
      return (
        <FeedbackState
          title = "Recipes could not be loaded"
          message = {error ?? "Check your device storage and try again."}
          actionLabel = "Retry"
          onAction = {retryLoad} />
      );
    }
    if (recipes.length === 0) {
      return (
        <View style = {styles.emptyState} >
          <Text style = {styles.emptyTitle} >Your collection is empty</Text>
          <Text style = {styles.emptyMessage} >
            Add a recipe to start building your collection.
          </Text>
          <AppButton label = "Add Recipe" onPress = {openAddRecipe} />
        </View>
      );
    }
    if (filteredRecipes.length === 0) {
      return (
        <View style = {styles.emptyState} >
          <Text style = {styles.emptyTitle} >No recipes found</Text>
          <Text style = {styles.emptyMessage} >
            Try another search or clear your filters.
          </Text>
          <AppButton
            label = "Clear filters"
            onPress = {clearFilters}
            variant = "outline" />
          <AppButton
            label = "Add Recipe"
            onPress = {openAddRecipe}
            variant = "text" />
        </View>
      );
    }
    return (
      <View style = {styles.list} >
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key = {recipe.id}
            recipe = {recipe}
            onPress = {() => openRecipe(recipe.id)} />
        ))}
      </View>
    );
  }

  return (
    <>
      <AppScreen bottomSpace >
        <AppTopBar  />
        <View style = {styles.titleRow} >
          <Text style = {styles.heading} >Recipes</Text>
          <Text style = {styles.count} >{recipes.length}</Text>
        </View>
        <AppTextInput
          label = "Search recipes"
          accessibilityLabel = "Search recipes by name"
          placeholder = "Search recipes..."
          value = {search}
          onChangeText = {setSearch}
          returnKeyType = "search"
          style = {styles.searchInput} />
        <CategorySelector
          selected = {category}
          onSelect = {setCategory}
          includeAll />
        {hasFilters ? (
          <AppButton
            label = "Clear filters"
            onPress = {clearFilters}
            variant = "text"
            style = {styles.clearButton} />
        ) : null}
        {getCollectionContent()}
      </AppScreen>
      <BottomNavigation  />
    </>
  );
}

function getVisibleRecipes(recipes, search, category) {
  const searchText = search.trim().toLocaleLowerCase();
  return recipes.filter((recipe) => {
    const matchesName = recipe.name.toLocaleLowerCase().includes(searchText);
    const matchesCategory = category === "All" || recipe.category === category;
    return matchesName && matchesCategory;
  });
}

export default RecipesScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },

    heading: {
      color: colors.greenDark,
      fontSize: 29,
      fontWeight: "800",
    },

    count: {
      color: colors.greenDark,
      fontSize: 13,
      fontWeight: "700",
      backgroundColor: colors.greenSoft,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 12,
    },

    searchInput: {
      backgroundColor: colors.surface,
    },

    clearButton: {
      alignSelf: "flex-start",
      minHeight: 38,
      marginTop: spacing.xs,
    },

    list: {
      marginTop: spacing.sm,
    },

    emptyState: {
      alignItems: "flex-start",
      gap: spacing.sm,
      paddingTop: spacing.xl,
    },

    emptyTitle: {
      color: colors.greenDark,
      fontSize: 20,
      fontWeight: "700",
    },

    emptyMessage: {
      color: colors.muted,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing.sm,
    },
  });
