import { Stack } from "expo-router";

import { RecipeProvider } from "../context/RecipeContext";
import { SessionProvider, useSession } from "../context/SessionContext";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";

function RootNavigator() {
  const { account } = useSession();
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions = {{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "none",
      }} >
      <Stack.Protected guard = {!account} redirectTo = "/home" >
        <Stack.Screen name = "index" />
        <Stack.Screen name = "login" />
        <Stack.Screen name = "register" />
      </Stack.Protected>

      <Stack.Protected guard = {Boolean(account)} redirectTo = "/login" >
        <Stack.Screen name = "home" />
        <Stack.Screen name = "recipes" />
        <Stack.Screen name = "profile" />
        <Stack.Screen name = "recipes/add" />
        <Stack.Screen name = "recipes/[recipeId]" />
        <Stack.Screen name = "recipes/[recipeId]/edit" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <RecipeProvider>
          <RootNavigator  />
        </RecipeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
