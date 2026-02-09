import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TireloOnboardingScreen from '../screens/auth/TireloOnboardingScreen';
import TireloSignInScreen from '../screens/auth/TireloSignInScreen';
import TireloSignUpScreen from '../screens/auth/TireloSignUpScreen';
import TireloHomeScreen from '../screens/auth/TireloHomeScreen';
import TireloLoadingScreen from '../screens/auth/TireloLoadingScreen';
import TireloDailyWisdomScreen from '../screens/auth/TireloDailyWisdomScreen';
import TireloDailyWisdomDetailScreen from '../screens/auth/TireloDailyWisdomDetailScreen';
import TireloExploreScreen from '../screens/auth/TireloExploreScreen';
import TireloAffirmationsScreen from '../screens/auth/TireloAffirmationsScreen';
import TireloCognitiveReframingScreen from '../screens/auth/TireloCognitiveReframingScreen';
import TireloCrisisSupportScreen from '../screens/auth/TireloCrisisSupportScreen';

import TireloChatHistoryScreen from '../screens/auth/TireloChatHistoryScreen';
import TireloProfileScreen from '../screens/auth/TireloProfileScreen';
import TireloChangePasswordScreen from '../screens/auth/TireloChangePasswordScreen';
import TireloFAQScreen from '../screens/auth/TireloFAQScreen';
import TireloTermsScreen from '../screens/auth/TireloTermsScreen';
import TireloPrivacyPolicyScreen from '../screens/auth/TireloPrivacyPolicyScreen';
import TireloConditionsScreen from '../screens/auth/TireloConditionsScreen';
import TireloResourcesScreen from '../screens/auth/TireloResourcesScreen';
import TireloSaveMeScreen from '../screens/auth/TireloSaveMeScreen';
import TireloNotificationsScreen from '../screens/auth/TireloNotificationsScreen';
import TireloDailyCheckupScreen from '../screens/auth/TireloDailyCheckupScreen';
import TireloAccountSuccessScreen from '../screens/auth/TireloAccountSuccessScreen';
import TireloForgotPasswordScreen from '../screens/auth/TireloForgotPasswordScreen';
import TireloAiChatScreen from '../screens/auth/TireloAiChatScreen';

import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
    const { user } = useAuth();

    return (
        <Stack.Navigator
            initialRouteName={user ? "TireloHome" : "TireloSignIn"}
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#FFFFFF' },
            }}
        >
            <Stack.Screen name="TireloSignIn" component={TireloSignInScreen} />
            <Stack.Screen name="TireloSignUp" component={TireloSignUpScreen} />
            <Stack.Screen name="TireloHome" component={TireloHomeScreen} />
            <Stack.Screen name="TireloLoading" component={TireloLoadingScreen} />
            <Stack.Screen name="TireloDailyWisdom" component={TireloDailyWisdomScreen} />
            <Stack.Screen name="TireloDailyWisdomDetail" component={TireloDailyWisdomDetailScreen} />
            <Stack.Screen name="TireloExplore" component={TireloExploreScreen} />
            <Stack.Screen name="TireloAffirmations" component={TireloAffirmationsScreen} />
            <Stack.Screen name="TireloCognitiveReframing" component={TireloCognitiveReframingScreen} />
            <Stack.Screen name="TireloCrisisSupport" component={TireloCrisisSupportScreen} />
            <Stack.Screen name="TireloDailyCheckup" component={TireloDailyCheckupScreen} />
            <Stack.Screen name="TireloChatHistory" component={TireloChatHistoryScreen} />
            <Stack.Screen name="TireloProfile" component={TireloProfileScreen} />
            <Stack.Screen name="TireloChangePassword" component={TireloChangePasswordScreen} />
            <Stack.Screen name="TireloFAQ" component={TireloFAQScreen} />
            <Stack.Screen name="TireloTerms" component={TireloTermsScreen} />
            <Stack.Screen name="TireloPrivacyPolicy" component={TireloPrivacyPolicyScreen} />
            <Stack.Screen name="TireloConditions" component={TireloConditionsScreen} />
            <Stack.Screen name="TireloResources" component={TireloResourcesScreen} />
            <Stack.Screen name="TireloSaveMe" component={TireloSaveMeScreen} />
            <Stack.Screen name="TireloNotifications" component={TireloNotificationsScreen} />

            <Stack.Screen name="TireloAccountSuccess" component={TireloAccountSuccessScreen} />
            <Stack.Screen name="TireloForgotPassword" component={TireloForgotPasswordScreen} />
            <Stack.Screen name="TireloAiChat" component={TireloAiChatScreen} />
        </Stack.Navigator>
    );
}
