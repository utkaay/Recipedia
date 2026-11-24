import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppScreen, PageHeader } from "../components/AppScreen";
import { AppTextInput } from "../components/AppTextInput";
import { useSession } from "../context/SessionContext";
import { loginSchema } from "../schemas/authSchemas";
import { spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

export function LoginScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { login, isSubmitting } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function updateEmail(value) {
    setEmail(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      email: undefined,
    }));
  }

  function updatePassword(value) {
    setPassword(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
    }));
  }

  async function handleLogin() {
    if (isSubmitting) return;
    setFormError("");
    const result = loginSchema.safeParse({
      email,
      password,
    });
    if (!result.success) {
      const nextErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    try {
      await login(result.data.email, result.data.password);
      router.replace("/home");
    } catch (error) {
      let message = "We could not sign you in. Try again.";
      if (error instanceof Error) {
        message = error.message;
      }
      setFormError(message);
    }
  }

  let formErrorMessage;
  if (formError) {
    formErrorMessage = (
      <Text accessibilityRole = "alert" style = {styles.error} >
        {formError}
      </Text>
    );
  }

  return (
    <AppScreen centered >
      <View style = {styles.content} >
        <PageHeader>
          <Text style = {styles.brand} >Recipedia</Text>
          <View style = {styles.brandAccent} />
        </PageHeader>
        <Text style = {styles.heading} >Welcome back</Text>
        <Text style = {styles.subtitle} >Sign in to your recipe collection.</Text>

        <AppTextInput
          label = "Email"
          value = {email}
          onChangeText = {updateEmail}
          error = {errors.email}
          placeholder = "you@example.com"
          keyboardType = "email-address"
          autoCapitalize = "none"
          autoCorrect = {false}
          autoComplete = "email"
          returnKeyType = "next" />
        <AppTextInput
          label = "Password"
          value = {password}
          onChangeText = {updatePassword}
          error = {errors.password}
          placeholder = "Enter your password"
          secureTextEntry
          autoCapitalize = "none"
          autoCorrect = {false}
          autoComplete = "current-password"
          returnKeyType = "done"
          onSubmitEditing = {handleLogin} />
        {formErrorMessage}
        <AppButton
          label = "Log In"
          onPress = {handleLogin}
          loading = {isSubmitting}
          style = {styles.button} />

        <View style = {styles.registerRow} >
          <Text style = {styles.bodyText} >New to Recipedia? </Text>
          <Link href = "/register" style = {styles.link} >
            Create an account
          </Link>
        </View>
        <Image
          accessibilityLabel = "Tomatoes on the vine with fresh herbs"
          source = {require("../../assets/images/tomatoes-herbs.png")}
          resizeMode = "contain"
          style = {styles.illustration} />
      </View>
    </AppScreen>
  );
}

export default LoginScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      width: "100%",
      maxWidth: 500,
      alignSelf: "center",
    },

    brand: {
      color: colors.greenDark,
      fontSize: 28,
      fontWeight: "900",
      letterSpacing: -0.6,
    },

    brandAccent: {
      height: 3,
      width: 52,
      backgroundColor: colors.terracotta,
      borderRadius: 4,
      marginTop: 2,
    },

    heading: {
      color: colors.greenDark,
      fontSize: 29,
      fontWeight: "800",
      marginTop: spacing.xl,
    },

    subtitle: {
      color: colors.ink,
      fontSize: 16,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },

    error: {
      color: colors.error,
      fontSize: 14,
      marginBottom: spacing.md,
    },

    button: {
      marginTop: spacing.xs,
      minHeight: 52,
      borderRadius: 25,
    },

    registerRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: spacing.md,
    },

    bodyText: {
      color: colors.ink,
      fontSize: 14,
    },

    link: {
      color: colors.greenDark,
      fontSize: 14,
      fontWeight: "700",
      textDecorationLine: "underline",
    },

    illustration: {
      width: "100%",
      height: 165,
      marginTop: spacing.md,
    },
  });
