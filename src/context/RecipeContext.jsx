import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useSession } from "./SessionContext";
import { loadRecipes, saveRecipes } from "../storage/recipeStorage";

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  const { account } = useSession();
  let initialUserId = null;
  if (account && account.id !== undefined && account.id !== null) {
    initialUserId = account.id;
  }
  const [collection, setCollection] = useState({
    userId: undefined,
    recipes: [],
    status: "loading",
    error: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const writeInProgress = useRef(false);
  const activeUserId = useRef(initialUserId);
  let currentUserId = null;
  if (account && account.id !== undefined && account.id !== null) {
    currentUserId = account.id;
  }
  const isCurrentCollection = collection.userId === currentUserId;
  let recipes = [];
  let error = null;
  if (isCurrentCollection) {
    recipes = collection.recipes;
    error = collection.error;
  }
  let status;
  if (!currentUserId) {
    status = "ready";
  } else if (isCurrentCollection) {
    status = collection.status;
  } else {
    status = "loading";
  }

  async function persistCollection(nextRecipes) {
    const userId = account?.id;
    if (!userId || status !== "ready") {
      throw new Error(
        "Wait until recipes finish loading before making changes.",
      );
    }
    if (writeInProgress.current) {
      throw new Error("A save is already in progress. Please wait.");
    }
    writeInProgress.current = true;
    setIsSaving(true);
    try {
      await saveRecipes(userId, nextRecipes);
      if (activeUserId.current === userId) {
        setCollection({
          userId,
          recipes: nextRecipes,
          status: "ready",
          error: null,
        });
      }
    } catch {
      throw new Error("Your changes could not be saved. Please try again.");
    } finally {
      writeInProgress.current = false;
      setIsSaving(false);
    }
  }

  async function addRecipe(draft) {
    let recipeId = createRecipeId();
    while (recipes.some((recipe) => recipe.id === recipeId)) {
      recipeId = createRecipeId();
    }
    const recipe = {
      ...draft,
      id: recipeId,
    };
    await persistCollection([...recipes, recipe]);
    return recipe;
  }

  async function updateRecipe(recipeId, draft) {
    const recipeExists = recipes.some((recipe) => recipe.id === recipeId);
    if (!recipeExists) {
      throw new Error("This recipe is no longer available.");
    }
    const updatedRecipes = recipes.map((recipe) => {
      if (recipe.id === recipeId) {
        return {
          ...draft,
          id: recipeId,
        };
      }
      return recipe;
    });
    await persistCollection(updatedRecipes);
  }

  async function deleteRecipe(recipeId) {
    const recipeExists = recipes.some((recipe) => recipe.id === recipeId);
    if (!recipeExists) {
      throw new Error("This recipe is no longer available.");
    }
    const remainingRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    await persistCollection(remainingRecipes);
  }

  function retryLoad() {
    setCollection((currentCollection) => ({
      ...currentCollection,
      status: "loading",
      error: null,
    }));
    setRetryCount((count) => count + 1);
  }

  useEffect(() => {
    let isCurrentLoad = true;
    const userId = currentUserId;
    activeUserId.current = userId;
    if (!userId) {
      Promise.resolve().then(() => {
        if (isCurrentLoad) {
          setCollection({
            userId: null,
            recipes: [],
            status: "ready",
            error: null,
          });
        }
      });
      return () => {
        isCurrentLoad = false;
      };
    }
    loadRecipes(userId)
      .then((restoredRecipes) => {
        if (!isCurrentLoad) return;
        setCollection({
          userId,
          recipes: restoredRecipes,
          status: "ready",
          error: null,
        });
      })
      .catch((loadError) => {
        if (!isCurrentLoad) return;
        let message = "Recipes could not be loaded from this device.";
        if (loadError instanceof Error) {
          message = loadError.message;
        }
        setCollection({
          userId,
          recipes: [],
          status: "error",
          error: message,
        });
      });
    return () => {
      isCurrentLoad = false;
    };
  }, [currentUserId, retryCount]);

  return (
    <RecipeContext.Provider
      value = {{
        recipes,
        status,
        error,
        isSaving,
        retryLoad,
        addRecipe,
        updateRecipe,
        deleteRecipe,
      }} >
      {children}
    </RecipeContext.Provider>
  );
}

function createRecipeId() {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `recipe-${timePart}-${randomPart}`;
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used inside RecipeProvider.");
  }
  return context;
}
