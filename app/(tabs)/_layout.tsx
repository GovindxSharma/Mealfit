import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { Home, Utensils, Dumbbell, ArrowLeftRight, BarChart2 } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 8);
  const tabHeight = 58 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.cardBorder,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          elevation: 6,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home', 'Home'),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIconBox, focused && { backgroundColor: theme.primaryLight }]}>
              <Home size={size - 3} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="meal-plan"
        options={{
          title: t('meal_plan', 'Meals'),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIconBox, focused && { backgroundColor: theme.primaryLight }]}>
              <Utensils size={size - 3} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: t('workout', 'Workout'),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIconBox, focused && { backgroundColor: theme.primaryLight }]}>
              <Dumbbell size={size - 3} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: t('swaps', 'Swaps'),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIconBox, focused && { backgroundColor: theme.primaryLight }]}>
              <ArrowLeftRight size={size - 3} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: t('analytics', 'Analytics'),
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.tabIconBox, focused && { backgroundColor: theme.primaryLight }]}>
              <BarChart2 size={size - 3} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconBox: {
    width: 38,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
