import { z } from 'zod';
import { RECIPE_CATEGORIES } from '../types/recipe';

function listFromLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export const recipeFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter a recipe name.'),
  category: z
    .string()
    .trim()
    .min(1, 'Choose a category.')
    .pipe(z.enum(RECIPE_CATEGORIES, { error: 'Choose a valid category.' })),
  preparationTime: z
    .string()
    .trim()
    .min(1, 'Enter preparation time in minutes.')
    .regex(/^\d+$/, 'Enter a whole number of minutes.')
    .transform(Number)
    .pipe(z.number().int().positive('Time must be greater than zero.')),
  ingredients: z
    .string()
    .trim()
    .min(1, 'Enter at least one ingredient.')
    .transform(listFromLines)
    .refine((items) => items.length > 0, 'Enter at least one ingredient.'),
  instructions: z
    .string()
    .trim()
    .min(1, 'Enter at least one instruction.')
    .transform(listFromLines)
    .refine((items) => items.length > 0, 'Enter at least one instruction.'),
});

export const recipeListSchema = z
  .array(
    z.object({
      id: z.string().min(1),
      name: z.string().trim().min(1),
      category: z.enum(RECIPE_CATEGORIES),
      preparationTime: z.number().int().positive(),
      ingredients: z.array(z.string().trim().min(1)).min(1),
      instructions: z.array(z.string().trim().min(1)).min(1),
    }),
  )
  .refine((recipes) => new Set(recipes.map((recipe) => recipe.id)).size === recipes.length);

export type RecipeFormInput = z.input<typeof recipeFormSchema>;
export type RecipeFormOutput = z.output<typeof recipeFormSchema>;
