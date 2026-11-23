import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryPicker } from './CategorySelector';
import { AppButton } from './AppButton';
import { AppTextInput } from './AppTextInput';
import { colors, spacing } from '../theme/tokens';
import { recipeFormSchema, type RecipeFormInput, type RecipeFormOutput } from '../schemas/recipeSchema';
import type { Recipe, RecipeCategory } from '../types/recipe';

type RecipeFormProps = {
  mode: 'add' | 'edit';
  initialRecipe?: Recipe;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (recipe: RecipeFormOutput) => Promise<void>;
  onDelete?: () => void;
  deleting?: boolean;
};

type RecipeFormErrors = Partial<Record<keyof RecipeFormInput, string>>;

function toFormInput(recipe?: Recipe): RecipeFormInput {
  if (!recipe) {
    return {
      name: '',
      category: '',
      preparationTime: '',
      ingredients: '',
      instructions: '',
    };
  }

  return {
    name: recipe.name,
    category: recipe.category,
    preparationTime: String(recipe.preparationTime),
    ingredients: recipe.ingredients.join('\n'),
    instructions: recipe.instructions.join('\n'),
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
}: RecipeFormProps) {
  const [values, setValues] = useState<RecipeFormInput>(() => toFormInput(initialRecipe));
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [submitError, setSubmitError] = useState('');

  function updateValue(field: keyof RecipeFormInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  }

  async function submit() {
    if (saving || deleting) return;
    setSubmitError('');
    const result = recipeFormSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: RecipeFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RecipeFormInput | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    try {
      await onSubmit(result.data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'The recipe could not be saved. Try again.');
    }
  }

  return (
    <View>
      <Text style={styles.heading}>{mode === 'add' ? 'Add Recipe' : 'Edit Recipe'}</Text>
      <Text style={styles.subtitle}>
        {mode === 'add' ? 'Save a new recipe to your collection.' : 'Update your recipe details.'}
      </Text>

      <AppTextInput
        label="Name"
        placeholder="e.g., Vegetable Pasta"
        value={values.name}
        onChangeText={(value) => updateValue('name', value)}
        error={errors.name}
        returnKeyType="next"
        maxLength={100}
      />

      <CategoryPicker
        selected={values.category as RecipeCategory | ''}
        onSelect={(category) => updateValue('category', category)}
        error={errors.category}
      />

      <AppTextInput
        label="Preparation Time (minutes)"
        placeholder="e.g., 25"
        value={values.preparationTime}
        onChangeText={(value) => updateValue('preparationTime', value)}
        error={errors.preparationTime}
        keyboardType="number-pad"
        returnKeyType="next"
        maxLength={5}
      />

      <AppTextInput
        label="Ingredients"
        placeholder="Enter ingredients, one per line"
        value={values.ingredients}
        onChangeText={(value) => updateValue('ingredients', value)}
        error={errors.ingredients}
        multiline
        textAlignVertical="top"
      />

      <AppTextInput
        label="Instructions"
        placeholder="Enter step-by-step instructions, one per line"
        value={values.instructions}
        onChangeText={(value) => updateValue('instructions', value)}
        error={errors.instructions}
        multiline
        textAlignVertical="top"
      />

      {submitError ? <Text accessibilityRole="alert" style={styles.submitError}>{submitError}</Text> : null}

      <View style={styles.actions}>
        <AppButton label="Cancel" onPress={onCancel} variant="outline" style={styles.action} />
        <AppButton
          label={mode === 'add' ? 'Save Recipe' : 'Save Changes'}
          onPress={submit}
          loading={saving}
          disabled={deleting}
          style={styles.action}
        />
      </View>

      {onDelete ? (
        <AppButton
          label="Delete Recipe"
          onPress={onDelete}
          variant="danger"
          disabled={saving}
          loading={deleting}
          style={styles.deleteButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.greenDark, fontSize: 27, fontWeight: '800', marginTop: spacing.sm },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1 },
  deleteButton: { marginTop: spacing.sm },
  submitError: { color: colors.error, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
});
