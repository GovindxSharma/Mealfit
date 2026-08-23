import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeStorage } from '../services/storage';

export type ThemeMode = 'teal_balance' | 'system' | 'matte_black' | 'light_clean';

export interface ThemeColors {
  mode: string;
  isDark: boolean;
  background: string;
  backgroundSecondary: string;
  card: string;
  cardElevated: string;
  cardBorder: string;
  cardBorderActive: string;
  
  // Primary Teal & Mint Palette
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryGlow: string;

  secondary: string;
  secondaryLight: string;
  accent: string;
  mint: string;
  mintLight: string;
  
  amber: string;
  amberLight: string;
  amberGlow: string;
  
  cyan: string;
  cyanLight: string;
  
  indigo: string;
  indigoLight: string;
  indigoGlow: string;
  
  purple: string;
  purpleLight: string;
  
  rose: string;
  roseLight: string;
  
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
}

export const tealBalanceTheme: ThemeColors = {
  mode: 'teal_balance',
  isDark: false,
  background: '#FFFFFF',
  backgroundSecondary: '#F7FBF8',
  card: '#F7FBF8',
  cardElevated: '#FFFFFF',
  cardBorder: '#E2E8F0',
  cardBorderActive: '#1488A6',
  
  // Primary: Teal Balance (#1488A6)
  primary: '#1488A6',
  primaryDark: '#0D6277',
  primaryLight: '#CCF8F1',
  primaryGlow: 'rgba(20, 136, 166, 0.18)',

  // Secondary Mint (#20D4BF)
  secondary: '#20D4BF',
  secondaryLight: '#E6FFFA',
  accent: '#CCF8F1',
  mint: '#20D4BF',
  mintLight: '#CCF8F1',
  
  amber: '#D97706',
  amberLight: '#FEF3C7',
  amberGlow: 'rgba(217, 119, 6, 0.2)',
  
  cyan: '#1488A6',
  cyanLight: '#CCF8F1',
  
  indigo: '#4F46E5',
  indigoLight: '#EEF2FF',
  indigoGlow: 'rgba(79, 70, 229, 0.15)',
  
  purple: '#7C3AED',
  purpleLight: '#F3E8FF',
  
  rose: '#E11D48',
  roseLight: '#FFE4E6',
  
  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',
  
  // Alerts & Messages
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#1488A6',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  info: '#0284C7',
  infoLight: '#E0F2FE',
};

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: tealBalanceTheme,
  themeMode: 'teal_balance',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('teal_balance');

  useEffect(() => {
    (async () => {
      try {
        await SafeStorage.setItem('mealfit_theme_mode', 'teal_balance');
      } catch (e) {
        // Ignored
      }
    })();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await SafeStorage.setItem('mealfit_theme_mode', mode);
    } catch (e) {
      // Ignored
    }
  };

  const toggleTheme = () => {
    // Single theme locked to Teal Balance
    setThemeMode('teal_balance');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: tealBalanceTheme,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

