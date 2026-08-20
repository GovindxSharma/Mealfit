import React, { createContext, useContext, useState } from 'react';

export type ThemeMode = 'matte_black' | 'light_clean';

export interface ThemeColors {
  mode: ThemeMode;
  isDark: boolean;
  background: string;
  backgroundSecondary: string;
  card: string;
  cardElevated: string;
  cardBorder: string;
  cardBorderActive: string;
  
  // Primary Palette
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryGlow: string;
  
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
  success: string;
  warning: string;
}

const themePresets: Record<ThemeMode, ThemeColors> = {
  // 1. Matte Dark Black (Pure Stealth Black + Apple Pro Electric Azure Blue #0A84FF & Sunset Amber)
  matte_black: {
    mode: 'matte_black',
    isDark: true,
    background: '#000000',
    backgroundSecondary: '#0A0A0A',
    card: '#121212',
    cardElevated: '#181818',
    cardBorder: '#242424',
    cardBorderActive: 'rgba(10, 132, 255, 0.45)',
    
    // Primary: Pro Electric Azure Blue (Perfect balance with matte black)
    primary: '#0A84FF',
    primaryDark: '#0066CC',
    primaryLight: 'rgba(10, 132, 255, 0.14)',
    primaryGlow: 'rgba(10, 132, 255, 0.28)',
    
    amber: '#F59E0B',
    amberLight: 'rgba(245, 158, 11, 0.14)',
    amberGlow: 'rgba(245, 158, 11, 0.3)',
    
    cyan: '#38BDF8',
    cyanLight: 'rgba(56, 189, 248, 0.14)',
    
    indigo: '#6366F1',
    indigoLight: 'rgba(99, 102, 241, 0.15)',
    indigoGlow: 'rgba(99, 102, 241, 0.35)',
    
    purple: '#A855F7',
    purpleLight: 'rgba(168, 85, 247, 0.15)',
    
    rose: '#F43F5E',
    roseLight: 'rgba(244, 63, 94, 0.14)',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textSubtle: '#52525B',
    
    danger: '#EF4444',
    success: '#0A84FF',
    warning: '#F59E0B',
  },

  // 2. Clean Pearl Light (Crisp Daylight White + Lush Emerald Green & Amber)
  light_clean: {
    mode: 'light_clean',
    isDark: false,
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardBorderActive: 'rgba(5, 150, 105, 0.4)',
    
    // Primary: Fresh Emerald Green (Looks great on clean white)
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: 'rgba(5, 150, 105, 0.12)',
    primaryGlow: 'rgba(5, 150, 105, 0.22)',
    
    amber: '#D97706',
    amberLight: 'rgba(217, 119, 6, 0.12)',
    amberGlow: 'rgba(217, 119, 6, 0.25)',
    
    cyan: '#0284C7',
    cyanLight: 'rgba(2, 132, 199, 0.12)',
    
    indigo: '#4F46E5',
    indigoLight: 'rgba(79, 70, 229, 0.12)',
    indigoGlow: 'rgba(79, 70, 229, 0.2)',
    
    purple: '#7C3AED',
    purpleLight: 'rgba(124, 58, 237, 0.12)',
    
    rose: '#E11D48',
    roseLight: 'rgba(225, 29, 72, 0.12)',
    
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textSubtle: '#94A3B8',
    
    danger: '#DC2626',
    success: '#059669',
    warning: '#D97706',
  },
};

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themePresets.matte_black,
  themeMode: 'matte_black',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('matte_black');

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => (prev === 'matte_black' ? 'light_clean' : 'matte_black'));
  };

  const theme = themePresets[themeMode] || themePresets.matte_black;

  return (
    <ThemeContext.Provider
      value={{
        theme,
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
