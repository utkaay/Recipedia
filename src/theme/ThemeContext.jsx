import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

import { useSession } from "../context/SessionContext";
import { defaultPalette, palettes } from "./palettes";

const ThemeContext = createContext(null);

const THEME_STORAGE_PREFIX = "recipedia.theme.v1.";

export function ThemeProvider({ children }) {
  const { account } = useSession();
  const [selectedPalette, setSelectedPalette] = useState(defaultPalette);
  const [hydratedAccountId, setHydratedAccountId] = useState(null);
  const accountId = account?.id ?? "guest";
  const isReady = hydratedAccountId === accountId;
  const activePalette = isReady ? selectedPalette : defaultPalette;

  useEffect(() => {
    let isCurrentLoad = true;

    async function loadPalette() {
      try {
        const storedPalette = await AsyncStorage.getItem(
          `${THEME_STORAGE_PREFIX}${accountId}`,
        );
        const isValidPalette =
          storedPalette &&
          Object.prototype.hasOwnProperty.call(palettes, storedPalette);

        if (isCurrentLoad) {
          setSelectedPalette(isValidPalette ? storedPalette : defaultPalette);
        }
      } catch {
        if (isCurrentLoad) {
          setSelectedPalette(defaultPalette);
        }
      } finally {
        if (isCurrentLoad) {
          setHydratedAccountId(accountId);
        }
      }
    }

    loadPalette();

    return () => {
      isCurrentLoad = false;
    };
  }, [accountId]);

  async function selectPalette(paletteId) {
    if (!isReady) {
      throw new Error("Wait until your saved theme has loaded.");
    }
    if (!Object.prototype.hasOwnProperty.call(palettes, paletteId)) {
      throw new Error("Choose one of the available color themes.");
    }

    await AsyncStorage.setItem(
      `${THEME_STORAGE_PREFIX}${accountId}`,
      paletteId,
    );
    setSelectedPalette(paletteId);
  }

  return (
    <ThemeContext.Provider
      value = {{
        selectedPalette: activePalette,
        palettes,
        colors: palettes[activePalette].colors,
        selectPalette,
        isReady,
      }} >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return context;
}
