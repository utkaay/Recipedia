export const RECIPE_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export type Recipe = {
  id: string;
  name: string;
  category: RecipeCategory;
  preparationTime: number;
  ingredients: string[];
  instructions: string[];
};

export type RecipeDraft = Omit<Recipe, 'id'>;
