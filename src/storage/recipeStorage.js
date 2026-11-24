import AsyncStorage from "@react-native-async-storage/async-storage";

import { starterRecipes } from "../data/starterRecipes";
import { recipeListSchema } from "../schemas/recipeSchema";

const STORAGE_PREFIX = "recipedia.recipes.v1";

function storageKey(userId) {
  return `${STORAGE_PREFIX}.${userId}`;
}

export async function loadRecipes(userId) {
  const key = storageKey(userId);
  const saved = await AsyncStorage.getItem(key);
  if (saved === null) {
    const initialRecipes = starterRecipes.map((recipe) => ({
      ...recipe,
      ingredients: [...recipe.ingredients],
      instructions: [...recipe.instructions],
    }));
    await AsyncStorage.setItem(key, JSON.stringify(initialRecipes));
    return initialRecipes;
  }
  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch {
    throw new Error(
      "Saved recipes are unreadable. Your stored data was left unchanged.",
    );
  }
  const result = recipeListSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "Saved recipes have an invalid format. Your stored data was left unchanged.",
    );
  }
  return result.data;
}

export async function saveRecipes(userId, recipes) {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(recipes));
}
