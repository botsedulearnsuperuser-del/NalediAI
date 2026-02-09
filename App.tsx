// Polyfills for Supabase compatibility - must be imported first
import 'react-native-url-polyfill/auto';
import { Buffer } from '@craftzdog/react-native-buffer';
global.Buffer = Buffer;

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return null; // You can add a splash screen here
  }

  return (
    <PaperProvider theme={isDark ? theme.dark : theme.light}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
}

import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

// Set navigation bar behavior for Android
if (Platform.OS === 'android') {
  NavigationBar.setBackgroundColorAsync('#FFFFFF');
  NavigationBar.setButtonStyleAsync('dark');
  // This prevents the navigation bar from hiding/showing automatically or overlapping content unexpectedly
  NavigationBar.setPositionAsync('absolute');
  NavigationBar.setVisibilityAsync('visible');
  // Ensure we don't have translucent status/nav bars causing layout shifts
  NavigationBar.setBehaviorAsync('inset-swipe');
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

