import { createContext, useContext, useRef, useState } from "react";
import {
  changeAccountPassword,
  findAccountByEmail,
  registerLocalAccount,
  verifyAccountPassword,
} from "../storage/accountStorage";
import { DEMO_CREDENTIALS, demoAccount } from "../data/mockCredentials";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operationInProgress = useRef(false);

  async function login(email, password) {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const isDemoLogin =
        normalizedEmail === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password;
      if (isDemoLogin) {
        setAccount(demoAccount);
        return;
      }
      const localAccount = await findAccountByEmail(normalizedEmail);
      if (
        !localAccount ||
        !(await verifyAccountPassword(localAccount, password))
      ) {
        throw new Error("Email or password is incorrect.");
      }
      setAccount(localAccount);
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  async function register(name, email, password) {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      const localAccount = await registerLocalAccount(name, email, password);
      setAccount(localAccount);
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  async function changePassword(currentPassword, newPassword) {
    if (operationInProgress.current) {
      throw new Error("Another account action is already in progress.");
    }
    if (!account || account.id === demoAccount.id) {
      throw new Error("Password changes are unavailable for this account.");
    }
    operationInProgress.current = true;
    setIsSubmitting(true);
    try {
      await changeAccountPassword(account, currentPassword, newPassword);
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  function logout() {
    setAccount(null);
  }

  return (
    <SessionContext.Provider
      value = {{
        account,
        isSubmitting,
        login,
        register,
        changePassword,
        logout,
      }} >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside SessionProvider.");
  }
  return context;
}
