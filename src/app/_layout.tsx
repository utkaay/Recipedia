import { Stack } from 'expo-router';
import { RecipeProvider } from '../context/RecipeContext';
import { SessionProvider, useSession } from '../context/SessionContext';
import { colors } from '../theme/tokens';

function RootNavigator() {
  const { account } = useSession();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Protected guard={!account} redirectTo="/home">
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Protected guard={Boolean(account)} redirectTo="/login">
        <Stack.Screen name="home" />
        <Stack.Screen name="recipes" />
        <Stack.Screen name="recipes/add" />
        <Stack.Screen name="recipes/[recipeId]" />
        <Stack.Screen name="recipes/[recipeId]/edit" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RecipeProvider>
        <RootNavigator />
      </RecipeProvider>
    </SessionProvider>
  );
}
