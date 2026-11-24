import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { AppScreen } from "../components/AppScreen";
import { AppTextInput } from "../components/AppTextInput";
import { AppTopBar } from "../components/AppTopBar";
import { BottomNavigation } from "../components/BottomNavigation";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useSession } from "../context/SessionContext";
import { demoAccount } from "../data/mockCredentials";
import { changePasswordSchema } from "../schemas/authSchemas";
import { useTheme } from "../theme/ThemeContext";
import { corners, spacing } from "../theme/tokens";

export function ProfileScreen() {
  const router = useRouter();
  const { account, changePassword, isSubmitting, logout } = useSession();
  const {
    selectedPalette,
    palettes,
    colors,
    selectPalette,
    isReady: isThemeReady,
  } = useTheme();
  const styles = createStyles(colors);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [themeError, setThemeError] = useState("");
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const isDemoAccount = account?.id === demoAccount.id;

  function updatePassword(field, value) {
    setPasswords((currentPasswords) => ({
      ...currentPasswords,
      [field]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    setPasswordError("");
    setPasswordSuccess("");
  }

  async function saveNewPassword() {
    if (isSubmitting || isDemoAccount) return;
    setPasswordError("");
    setPasswordSuccess("");
    const result = changePasswordSchema.safeParse(passwords);
    if (!result.success) {
      const nextErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    try {
      await changePassword(
        result.data.currentPassword,
        result.data.newPassword,
      );
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordSuccess("Your password was changed.");
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Your password could not be changed. Try again.",
      );
    }
  }

  async function choosePalette(paletteId) {
    if (!isThemeReady || isSavingTheme || paletteId === selectedPalette) return;
    setThemeError("");
    setIsSavingTheme(true);
    try {
      await selectPalette(paletteId);
    } catch (error) {
      setThemeError(
        error instanceof Error
          ? error.message
          : "Your theme could not be saved. Try again.",
      );
    } finally {
      setIsSavingTheme(false);
    }
  }

  function confirmLogout() {
    setShowLogoutConfirmation(false);
    logout();
    router.replace("/login");
  }

  return (
    <>
      <AppScreen bottomSpace >
        <AppTopBar  />
        <Text style = {styles.heading} >Profile</Text>

        <View style = {styles.accountCard} >
          <View style = {styles.avatar} >
            <Text style = {styles.avatarText} >
              {(account?.name ?? "R").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style = {styles.accountDetails} >
            <Text style = {styles.accountName} >{account?.name ?? "Cook"}</Text>
            <Text style = {styles.accountEmail} >{account?.email ?? ""}</Text>
          </View>
        </View>

        <View style = {styles.section} >
          <Text style = {styles.sectionTitle} >Theme</Text>
          <Text style = {styles.sectionDescription} >
            Choose the color palette for your recipe notebook.
          </Text>
          {Object.entries(palettes).map(([paletteId, palette]) => {
            const selected = paletteId === selectedPalette;
            return (
              <Pressable
                key = {paletteId}
                accessibilityRole = "radio"
                accessibilityState = {{
                  checked: selected,
                  disabled: !isThemeReady || isSavingTheme,
                }}
                disabled = {!isThemeReady || isSavingTheme}
                onPress = {() => choosePalette(paletteId)}
                style = {[
                  styles.paletteOption,
                  selected && styles.selectedPalette,
                ]} >
                <View
                  style = {[
                    styles.paletteSwatch,
                    { backgroundColor: palette.colors.green },
                  ]} />
                <View style = {styles.paletteCopy} >
                  <Text style = {styles.paletteName} >{palette.name}</Text>
                  <Text style = {styles.paletteSubtitle} >
                    Cream, {paletteId === "herb" ? "green" : paletteId}, and
                    warm accents
                  </Text>
                </View>
                <View
                  style = {[
                    styles.radioOuter,
                    selected && styles.radioOuterSelected,
                  ]} >
                  {selected ? <View style = {styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
          {themeError ? (
            <Text accessibilityRole = "alert" style = {styles.error} >
              {themeError}
            </Text>
          ) : null}
        </View>

        <View style = {styles.section} >
          <Text style = {styles.sectionTitle} >Change Password</Text>
          {isDemoAccount ? (
            <Text style = {styles.sectionDescription} >
              Password changes are unavailable for the sample account.
            </Text>
          ) : (
            <>
              <Text style = {styles.sectionDescription} >
                Update the password saved for this account on this device.
              </Text>
              <AppTextInput
                label = "Current password"
                value = {passwords.currentPassword}
                onChangeText = {(value) =>
                  updatePassword("currentPassword", value)
                }
                error = {fieldErrors.currentPassword}
                secureTextEntry
                autoCapitalize = "none"
                autoCorrect = {false}
                autoComplete = "current-password" />
              <AppTextInput
                label = "New password"
                value = {passwords.newPassword}
                onChangeText = {(value) =>
                  updatePassword("newPassword", value)
                }
                error = {fieldErrors.newPassword}
                placeholder = "At least 8 characters"
                secureTextEntry
                autoCapitalize = "none"
                autoCorrect = {false}
                autoComplete = "new-password" />
              <AppTextInput
                label = "Confirm new password"
                value = {passwords.confirmPassword}
                onChangeText = {(value) =>
                  updatePassword("confirmPassword", value)
                }
                error = {fieldErrors.confirmPassword}
                secureTextEntry
                autoCapitalize = "none"
                autoCorrect = {false}
                autoComplete = "new-password"
                returnKeyType = "done"
                onSubmitEditing = {saveNewPassword} />
              {passwordError ? (
                <Text accessibilityRole = "alert" style = {styles.error} >
                  {passwordError}
                </Text>
              ) : null}
              {passwordSuccess ? (
                <Text accessibilityRole = "status" style = {styles.success} >
                  {passwordSuccess}
                </Text>
              ) : null}
              <AppButton
                label = "Save New Password"
                onPress = {saveNewPassword}
                loading = {isSubmitting} />
            </>
          )}
        </View>

        <View style = {styles.logoutSection} >
          <Text style = {styles.sectionTitle} >Log Out</Text>
          <Text style = {styles.sectionDescription} >
            You can sign back in to your recipe collection later.
          </Text>
          <AppButton
            label = "Log Out"
            variant = "danger"
            onPress = {() => setShowLogoutConfirmation(true)} />
        </View>
      </AppScreen>
      <BottomNavigation  />
      <ConfirmDialog
        visible = {showLogoutConfirmation}
        title = "Log out of Recipedia?"
        message = {
          "You will return to the sign-in screen. Your recipes will stay saved on this device."
        }
        confirmLabel = "Log Out"
        onCancel = {() => setShowLogoutConfirmation(false)}
        onConfirm = {confirmLogout} />
    </>
  );
}

export default ProfileScreen;

const createStyles = (colors) =>
  StyleSheet.create({
    heading: {
      color: colors.greenDark,
      fontSize: 29,
      fontWeight: "800",
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },

    accountCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: corners.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
    },

    avatar: {
      width: 54,
      height: 54,
      borderRadius: corners.pill,
      backgroundColor: colors.greenSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      color: colors.greenDark,
      fontSize: 24,
      fontWeight: "800",
    },

    accountDetails: {
      flex: 1,
      gap: spacing.xs,
    },

    accountName: {
      color: colors.greenDark,
      fontSize: 18,
      fontWeight: "700",
    },

    accountEmail: {
      color: colors.muted,
      fontSize: 14,
    },

    section: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: corners.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
    },

    sectionTitle: {
      color: colors.greenDark,
      fontSize: 19,
      fontWeight: "800",
    },

    sectionDescription: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },

    paletteOption: {
      minHeight: 62,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: corners.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm,
    },

    selectedPalette: {
      borderColor: colors.green,
      backgroundColor: colors.surfaceGreen,
    },

    paletteSwatch: {
      width: 28,
      height: 28,
      borderRadius: corners.pill,
      borderWidth: 4,
      borderColor: colors.white,
    },

    paletteCopy: {
      flex: 1,
    },

    paletteName: {
      color: colors.greenDark,
      fontSize: 15,
      fontWeight: "700",
    },

    paletteSubtitle: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 2,
    },

    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: corners.pill,
      borderWidth: 2,
      borderColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },

    radioOuterSelected: {
      borderColor: colors.green,
    },

    radioInner: {
      width: 10,
      height: 10,
      borderRadius: corners.pill,
      backgroundColor: colors.green,
    },

    logoutSection: {
      padding: spacing.md,
      marginBottom: spacing.lg,
    },

    error: {
      color: colors.error,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },

    success: {
      color: colors.greenDark,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
  });
