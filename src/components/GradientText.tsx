import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps {
  colors: string[];
  style?: any;
  children: React.ReactNode;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
}

// Simple gradient text using a workaround - for now just use white text
// In production, you'd use react-native-svg with TextPath or a library like react-native-linear-gradient-text
export default function GradientText({ 
  colors, 
  style, 
  children, 
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale 
}: GradientTextProps) {
  // For now, return white text as gradient text requires additional libraries
  // The gradient effect can be added later with react-native-svg or similar
  return (
    <Text 
      style={[style, { color: '#FFFFFF' }]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
    >
      {children}
    </Text>
  );
}

