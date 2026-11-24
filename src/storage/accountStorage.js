import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

import {
  readCredential,
  removeCredential,
  saveCredential,
} from "./credentialStorage";
import { DEMO_CREDENTIALS } from "../data/mockCredentials";

const ACCOUNTS_KEY = "recipedia.accounts.v1";

const accountListSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string().trim().min(1),
    email: z.email().trim(),
  }),
);

function createAccountId() {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function loadAccounts() {
  const saved = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (saved === null) return [];
  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch {
    throw new Error(
      "Saved accounts could not be read. Your stored data was left unchanged.",
    );
  }
  const result = accountListSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "Saved accounts have an invalid format. Your stored data was left unchanged.",
    );
  }
  return result.data;
}

export async function findAccountByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = await loadAccounts();
  return accounts.find(
    (account) => account.email.toLowerCase() === normalizedEmail,
  );
}

export async function verifyAccountPassword(account, password) {
  const savedPassword = await readCredential(account.id);
  return savedPassword !== null && savedPassword === password;
}

export async function changeAccountPassword(account, currentPassword, newPassword) {
  const isCurrentPasswordValid = await verifyAccountPassword(
    account,
    currentPassword,
  );
  if (!isCurrentPasswordValid) {
    throw new Error("Your current password is incorrect.");
  }
  await saveCredential(account.id, newPassword);
}

export async function registerLocalAccount(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === DEMO_CREDENTIALS.email) {
    throw new Error(
      "This email is reserved for the sample account. Choose another email.",
    );
  }
  const accounts = await loadAccounts();
  if (
    accounts.some((account) => account.email.toLowerCase() === normalizedEmail)
  ) {
    throw new Error(
      "An account with this email already exists on this device.",
    );
  }
  const account = {
    id: createAccountId(),
    name: name.trim(),
    email: normalizedEmail,
  };
  await saveCredential(account.id, password);
  try {
    await AsyncStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify([...accounts, account]),
    );
  } catch (error) {
    await removeCredential(account.id).catch(() => undefined);
    throw error;
  }
  return account;
}
