import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import {
  findAccountByEmail,
  registerLocalAccount,
  verifyAccountPassword,
} from '../storage/accountStorage';
import { DEMO_CREDENTIALS, demoAccount } from '../data/mockCredentials';
import type { LocalAccount } from '../types/user';

type SessionContextValue = {
  account: LocalAccount | null;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operationInProgress = useRef(false);

  async function login(email: string, password: string) {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (
        normalizedEmail === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        setAccount(demoAccount);
        return;
      }

      const localAccount = await findAccountByEmail(normalizedEmail);
      if (!localAccount || !(await verifyAccountPassword(localAccount, password))) {
        throw new Error('Email or password is incorrect.');
      }

      setAccount(localAccount);
    } finally {
      operationInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  async function register(name: string, email: string, password: string) {
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

  function logout() {
    setAccount(null);
  }

  return (
    <SessionContext.Provider value={{ account, isSubmitting, login, register, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside SessionProvider.');
  return context;
}
