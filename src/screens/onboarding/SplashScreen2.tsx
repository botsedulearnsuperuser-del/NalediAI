import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen2() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Start zoom animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start loading dots animation
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dotAnimations = [
      createDotAnimation(dot1Opacity, 0),
      createDotAnimation(dot2Opacity, 200),
      createDotAnimation(dot3Opacity, 400),
    ];

    Animated.parallel(dotAnimations).start();

    // Navigate to sign in after a delay
    const timer = setTimeout(() => {
      navigation.navigate('RiderSignIn' as never);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        {/* Background Pattern */}
        <View style={styles.backgroundContainer}>
          <LinearGradient
            colors={['rgba(27, 27, 27, 1)', 'rgba(40, 47, 63, 0.8)', 'rgba(27, 27, 27, 1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.backgroundGradient}
          />
          <Image
            source={require('../../../assets/images/Pattern.png')}
            style={styles.backgroundPattern}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          {/* Foot Logo with Zoom Animation */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require('../../../assets/images/tsamaya-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Loading Dots at Bottom */}
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.dot,
                { opacity: dot1Opacity },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                { opacity: dot2Opacity },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                { opacity: dot3Opacity },
              ]}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    width: width,
    height: height,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height + 100,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height + 100,
    opacity: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ACB2',
  },
});
