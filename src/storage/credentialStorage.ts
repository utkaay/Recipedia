import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const WEB_CREDENTIAL_PREFIX = 'recipedia.web-credential.';

function nativeCredentialKey(accountId: string) {
  return `recipedia-account-${accountId}`;
}

export async function saveCredential(accountId: string, password: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(`${WEB_CREDENTIAL_PREFIX}${accountId}`, password);
    return;
  }

  await SecureStore.setItemAsync(nativeCredentialKey(accountId), password);
}

export async function readCredential(accountId: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(`${WEB_CREDENTIAL_PREFIX}${accountId}`);
  }

  return SecureStore.getItemAsync(nativeCredentialKey(accountId));
}

export async function removeCredential(accountId: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(`${WEB_CREDENTIAL_PREFIX}${accountId}`);
    return;
  }

  await SecureStore.deleteItemAsync(nativeCredentialKey(accountId));
}
