import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { LifeStatusBadge } from '../src/components/LifeStatusBadge';
import { NotificationBanner } from '../src/components/NotificationBanner';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { Flame } from 'lucide-react-native';

function LayoutNavigation() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} backgroundColor={theme.background} />
      <NotificationBanner />
      <Stack
        screenOptions={{
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
            headerTitle: () => (
              <View style={styles.headerTitleRow}>
                <View style={[styles.logoBadge, { backgroundColor: theme.primaryLight, borderColor: theme.primaryGlow }]}>
                  <Flame size={16} color={theme.primary} />
                </View>
                <View>
                  <View style={styles.brandRow}>
                    <Text style={[styles.brandName, { color: theme.textPrimary }]}>MealFit</Text>
                    <View style={[styles.indiaBadge, { backgroundColor: theme.amberLight, borderColor: theme.amberGlow }]}>
                      <Text style={[styles.indiaText, { color: theme.amber }]}>INDIA</Text>
                    </View>
                  </View>
                </View>
              </View>
            ),
            headerRight: () => <LifeStatusBadge />,
          }}
        />
        <Stack.Screen
          name="onboarding/biometrics"
          options={{
            title: 'Your Biometrics',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="onboarding/goal-budget"
          options={{
            title: 'Goal & Kirana Budget',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <LayoutNavigation />
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
