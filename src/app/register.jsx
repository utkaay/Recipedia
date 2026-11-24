import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppScreen, PageHeader } from "../components/AppScreen";
import { AppTextInput } from "../components/AppTextInput";
import { useSession } from "../context/SessionContext";
import { registerSchema } from "../schemas/authSchemas";
import { useTheme } from "../theme/ThemeContext";
import { spacing } from "../theme/tokens";

export function RegisterScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { register, isSubmitting } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function updateName(value) {
    setName(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      name: undefined,
    }));
  }

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

  function updateConfirmPassword(value) {
    setConfirmPassword(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      confirmPassword: undefined,
    }));
  }

  async function handleRegister() {
    if (isSubmitting) return;
    setFormError("");
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
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
      await register(result.data.name, result.data.email, result.data.password);
      router.replace("/home");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Your account could not be created. Try again.",
      );
    }
  }

  return (
    <AppScreen centered >
      <View style = {styles.content} >
        <PageHeader>
          <Text style = {styles.brand} >Recipedia</Text>
          <View style = {styles.brandAccent} />
        </PageHeader>
        <Text style = {styles.heading} >Create an account</Text>
        <Text style = {styles.subtitle} >Start your own recipe collection.</Text>

        <AppTextInput
          label = "Name"
          value = {name}
          onChangeText = {updateName}
          error = {errors.name}
          placeholder = "Your name"
          autoComplete = "name"
          returnKeyType = "next"
          maxLength = {80} />
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
          placeholder = "At least 8 characters"
          secureTextEntry
          autoCapitalize = "none"
          autoCorrect = {false}
          autoComplete = "new-password"
          returnKeyType = "next" />
        <AppTextInput
          label = "Confirm Password"
          value = {confirmPassword}
          onChangeText = {updateConfirmPassword}
          error = {errors.confirmPassword}
          placeholder = "Enter your password again"
          secureTextEntry
          autoCapitalize = "none"
          autoCorrect = {false}
          autoComplete = "new-password"
          returnKeyType = "done"
          onSubmitEditing = {handleRegister} />
        <Text style = {styles.deviceNote} >
          Your account and recipes are saved on this device. They will not sync
          between devices until cloud accounts are added.
        </Text>
        {formError ? (
          <Text accessibilityRole = "alert" style = {styles.error} >
            {formError}
          </Text>
        ) : null}
        <AppButton
          label = "Create Account"
          onPress = {handleRegister}
          loading = {isSubmitting}
          style = {styles.button} />

        <View style = {styles.loginRow} >
          <Text style = {styles.bodyText} >Already have an account? </Text>
          <Link href = "/login" style = {styles.link} >
            Log in
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

export default RegisterScreen;

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
      marginBottom: spacing.md,
    },

    deviceNote: {
      color: colors.muted,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: spacing.md,
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

    loginRow: {
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
      height: 115,
      marginTop: spacing.sm,
    },
  });
