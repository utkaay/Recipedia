import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useSession } from './SessionContext';
import { loadRecipes, saveRecipes } from '../storage/recipeStorage';
import type { Recipe, RecipeDraft } from '../types/recipe';

type LoadStatus = 'loading' | 'ready' | 'error';

type RecipeContextValue = {
  recipes: Recipe[];
  status: LoadStatus;
  error: string | null;
  isSaving: boolean;
  retryLoad: () => void;
  addRecipe: (draft: RecipeDraft) => Promise<Recipe>;
  updateRecipe: (recipeId: string, draft: RecipeDraft) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
};

const RecipeContext = createContext<RecipeContextValue | null>(null);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const { account } = useSession();
  const [collection, setCollection] = useState<{
    userId: string | null | undefined;
    recipes: Recipe[];
    status: LoadStatus;
    error: string | null;
  }>({ userId: undefined, recipes: [], status: 'loading', error: null });
  const [isSaving, setIsSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const writeInProgress = useRef(false);
  const activeUserId = useRef<string | null>(account?.id ?? null);
  const currentUserId = account?.id ?? null;
  const isCurrentCollection = collection.userId === currentUserId;
  const recipes = isCurrentCollection ? collection.recipes : [];
  const status = !currentUserId
    ? 'ready'
    : isCurrentCollection
      ? collection.status
      : 'loading';
  const error = isCurrentCollection ? collection.error : null;

  useEffect(() => {
    let isCurrentLoad = true;
    const userId = account?.id ?? null;
    activeUserId.current = userId;

    if (!userId) {
      Promise.resolve().then(() => {
        if (isCurrentLoad) {
          setCollection({ userId: null, recipes: [], status: 'ready', error: null });
        }
      });
      return () => {
        isCurrentLoad = false;
      };
    }

    loadRecipes(userId)
      .then((restoredRecipes) => {
        if (!isCurrentLoad) return;
        setCollection({ userId, recipes: restoredRecipes, status: 'ready', error: null });
      })
      .catch((loadError: unknown) => {
        if (!isCurrentLoad) return;
        setCollection({
          userId,
          recipes: [],
          error: loadError instanceof Error
            ? loadError.message
            : 'Recipes could not be loaded from this device.',
          status: 'error',
        });
      });

    return () => {
      isCurrentLoad = false;
    };
  }, [account?.id, retryCount]);

  const retryLoad = useCallback(() => {
    setCollection((current) => ({ ...current, status: 'loading', error: null }));
    setRetryCount((count) => count + 1);
  }, []);

  async function persistCollection(nextRecipes: Recipe[]) {
    const userId = account?.id;
    if (!userId || status !== 'ready') {
      throw new Error('Wait until recipes finish loading before making changes.');
    }
    if (writeInProgress.current) {
      throw new Error('A save is already in progress. Please wait.');
    }

    writeInProgress.current = true;
    setIsSaving(true);
    try {
      // Keep the current collection visible until AsyncStorage confirms the write.
      await saveRecipes(userId, nextRecipes);
      if (activeUserId.current === userId) {
        setCollection({ userId, recipes: nextRecipes, status: 'ready', error: null });
      }
    } catch {
      throw new Error('Your changes could not be saved. Please try again.');
    } finally {
      writeInProgress.current = false;
      setIsSaving(false);
    }
  }

  async function addRecipe(draft: RecipeDraft) {
    let id = `recipe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    while (recipes.some((recipe) => recipe.id === id)) {
      id = `recipe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    }
    const recipe = { ...draft, id };
    await persistCollection([...recipes, recipe]);
    return recipe;
  }

  async function updateRecipe(recipeId: string, draft: RecipeDraft) {
    const exists = recipes.some((recipe) => recipe.id === recipeId);
    if (!exists) throw new Error('This recipe is no longer available.');

    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === recipeId ? { ...draft, id: recipeId } : recipe,
    );
    await persistCollection(updatedRecipes);
  }

  async function deleteRecipe(recipeId: string) {
    if (!recipes.some((recipe) => recipe.id === recipeId)) {
      throw new Error('This recipe is no longer available.');
    }
    await persistCollection(recipes.filter((recipe) => recipe.id !== recipeId));
  }

  return (
    <RecipeContext.Provider
      value={{ recipes, status, error, isSaving, retryLoad, addRecipe, updateRecipe, deleteRecipe }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipes must be used inside RecipeProvider.');
  return context;
}
