import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { corners, spacing } from "../theme/tokens";
import { RECIPE_CATEGORIES } from "../data/recipeCategories";
import { useTheme } from "../theme/ThemeContext";

export function CategorySelector({
  selected,
  onSelect,
  includeAll = false,
  label = "Choose a category",
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  let categories = [...RECIPE_CATEGORIES];
  if (includeAll) {
    categories = ["All", ...RECIPE_CATEGORIES];
  }

  return (
    <View>
      <Text style = {styles.label} >{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator = {false}
        contentContainerStyle = {styles.row} >
        {categories.map((category) => {
          const isSelected = category === selected;
          return (
            <Pressable
              key = {category}
              accessibilityRole = "button"
              accessibilityState = {{ selected: isSelected }}
              accessibilityLabel = {`${category}${isSelected ? ", selected" : ""}`}
              onPress = {() => onSelect(category)}
              style = {[styles.chip, isSelected && styles.chipSelected]} >
              <Text
                style = {[styles.chipText, isSelected && styles.chipTextSelected]} >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function CategoryPicker({ selected, onSelect, error }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style = {styles.pickerGroup} >
      <Text style = {styles.label} >Category</Text>
      <View style = {styles.pickerRow} >
        {RECIPE_CATEGORIES.map((category) => {
          const isSelected = category === selected;
          return (
            <Pressable
              key = {category}
              accessibilityRole = "button"
              accessibilityState = {{ selected: isSelected }}
              onPress = {() => onSelect(category)}
              style = {[styles.picker, isSelected && styles.pickerSelected]} >
              <Text
                style = {[
                  styles.pickerText,
                  isSelected && styles.pickerTextSelected,
                ]} >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text accessibilityRole = "alert" style = {styles.error} >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    label: {
      color: colors.greenDark,
      fontWeight: "700",
      fontSize: 15,
      marginBottom: spacing.sm,
    },

    row: {
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },

    chip: {
      paddingHorizontal: spacing.md,
      minHeight: 38,
      borderRadius: corners.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceGreen,
      justifyContent: "center",
    },

    chipSelected: {
      backgroundColor: colors.green,
      borderColor: colors.green,
    },

    chipText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.greenDark,
    },

    chipTextSelected: {
      color: colors.white,
    },

    pickerGroup: {
      marginBottom: spacing.md,
    },

    pickerRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },

    picker: {
      minHeight: 42,
      justifyContent: "center",
      paddingHorizontal: spacing.md,
      borderRadius: corners.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    pickerSelected: {
      backgroundColor: colors.green,
      borderColor: colors.green,
    },

    pickerText: {
      color: colors.greenDark,
      fontSize: 14,
      fontWeight: "600",
    },

    pickerTextSelected: {
      color: colors.white,
    },

    error: {
      color: colors.error,
      fontSize: 13,
      marginTop: spacing.xs,
    },
  });
