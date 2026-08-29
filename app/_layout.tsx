import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, LogBox } from 'react-native';
import { DraggableLivePill } from '../src/components/DraggableLivePill';
import { AnimatedSplashScreen } from '../src/components/AnimatedSplashScreen';
import { NotificationBanner } from '../src/components/NotificationBanner';
import { NotificationService } from '../src/services/notificationService';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { LanguageProvider } from '../src/context/LanguageContext';
import { Flame } from 'lucide-react-native';

// Filter benign terminal deprecation warning
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('expo-av') || args[0].includes('Expo AV has been deprecated'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Suppress benign SDK 54 deprecation logs so in-app UI is clean
LogBox.ignoreLogs([
  '[expo-av]: Expo AV has been deprecated',
  'expo-notifications',
]);

function LayoutNavigation() {
  const { theme } = useTheme();
  const { isSuperAdmin } = useAuth();
  const [splashFinished, setSplashFinished] = useState<boolean>(false);

  useEffect(() => {
    // Schedule all 6 daytime water reminders + 3 meal reminders on launch
    NotificationService.scheduleDailyReminders().catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} backgroundColor={theme.background} />
      <NotificationBanner />

      {!splashFinished && (
        <AnimatedSplashScreen onFinish={() => setSplashFinished(true)} />
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* Draggable Live Backend Status Pill - ONLY visible to Super Admin (Govind) */}
      {isSuperAdmin && <DraggableLivePill />}
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <LayoutNavigation />
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  indiaBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  indiaText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
