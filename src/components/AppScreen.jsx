import {

  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

export function AppScreen({ children, bottomSpace = false, centered = false }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView edges = {["top", "left", "right"]} style = {styles.safeArea} >
      <KeyboardAvoidingView
        style = {[styles.safeArea, { backgroundColor: colors.background }]}
        behavior = {Platform.OS === "ios" ? "padding" : undefined} >
        <ScrollView
          contentContainerStyle = {[
            styles.content,
            centered && styles.centered,
            bottomSpace && styles.withBottomNavigation,
          ]}
          keyboardShouldPersistTaps = "handled"
          keyboardDismissMode = "on-drag" >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function PageHeader({ children }) {
  return <View style = {styles.pageHeader} >{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  centered: {
    justifyContent: "center",
  },

  withBottomNavigation: {
    paddingBottom: 112,
  },

  pageHeader: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
