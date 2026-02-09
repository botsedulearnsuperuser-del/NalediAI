import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import OnboardingNavigator from './OnboardingNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // You can add a loading screen here
  }

  // This navigator handles both authenticated and non-authenticated states
  return <OnboardingNavigator />;
}

