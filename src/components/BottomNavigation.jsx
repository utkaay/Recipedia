import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

const navigationItems = [
  {
    label: "Home",
    icon: "home-outline",
    route: "/home",
  },
  {
    label: "Recipes",
    icon: "book-outline",
    route: "/recipes",
  },
  {
    label: "Add",
    icon: "add-circle-outline",
    route: "/recipes/add",
  },
  {
    label: "Profile",
    icon: "person-circle-outline",
    route: "/profile",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  function isNavigationItemSelected(item) {
    if (item.label === "Home") {
      return pathname === "/home";
    }
    if (item.label === "Recipes") {
      return pathname.startsWith("/recipes") && pathname !== "/recipes/add";
    }
    if (item.label === "Profile") {
      return pathname === "/profile";
    }
    return pathname === "/recipes/add";
  }

  function navigateTo(route) {
    router.replace(route);
  }

  return (
    <View
      style = {[
        styles.bar,
        { paddingBottom: Math.max(bottom, spacing.sm) },
      ]} >
      {navigationItems.map((item) => {
        const selected = isNavigationItemSelected(item);
        return (
          <Pressable
            key = {item.label}
            accessibilityRole = "button"
            accessibilityLabel = {item.label}
            accessibilityState = {{ selected }}
            onPress = {() => navigateTo(item.route)}
            style = {styles.item} >
            <Ionicons
              name = {item.icon}
              size = {23}
              color = {selected ? colors.greenDark : colors.green} />
            <Text style = {[styles.label, selected && styles.selectedLabel]} >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    bar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: 64,
      backgroundColor: colors.surfaceGreen,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingTop: spacing.xs,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },

    item: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
      minWidth: 62,
      gap: 1,
    },

    label: {
      color: colors.greenDark,
      fontSize: 11,
      fontWeight: "600",
    },

    selectedLabel: {
      fontWeight: "800",
    },
  });
