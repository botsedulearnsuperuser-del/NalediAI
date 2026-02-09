import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    Animated,
    ImageBackground
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';

const { width, height: screenHeight } = Dimensions.get('screen');
const { height: windowHeight } = Dimensions.get('window');

const DATA = [
    {
        id: '1',
        title: 'Your Mental Health\nCompanion',
        subtitle: 'Experience compassionate AI support for your mental wellness journey. Always here to listen and help.',
        image: null, // Using default dark background
    },
    {
        id: '2',
        title: 'Cognitive\nReframing',
        subtitle: 'Transform negative thoughts into positive perspectives. Master your mindset with proven techniques.',
        image: null,
    },
    {
        id: '3',
        title: 'Daily Wisdom &\nAffirmations',
        subtitle: 'Start your day with powerful affirmations and wisdom to build mental resilience and inner peace.',
        image: null,
    },
];

export default function TireloOnboardingScreen() {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    useFocusEffect(
        React.useCallback(() => {
            const setupImmersive = async () => {
                if (Platform.OS === 'android') {
                    try {
                        await NavigationBar.setPositionAsync('absolute');
                        await NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
                        await NavigationBar.setButtonStyleAsync('light');
                        await NavigationBar.setBehaviorAsync('overlay-swipe');

                        // Retry shortly after to ensure it sticks
                        setTimeout(async () => {
                            try {
                                await NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
                            } catch (e) {
                                // Ignore
                            }
                        }, 500);
                    } catch (e) {
                        console.log('NavigationBar update failed', e);
                    }
                }
            };

            setupImmersive();

            return () => {
                if (Platform.OS === 'android') {
                    NavigationBar.setPositionAsync('relative');
                    NavigationBar.setBackgroundColorAsync('#FFFFFF');
                    NavigationBar.setButtonStyleAsync('dark');
                }
            };
        }, [])
    );

    const handleNext = () => {
        if (currentIndex < DATA.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            navigation.navigate('TireloSignIn' as never);
        }
    };

    const handleSkip = () => {
        navigation.navigate('TireloSignIn' as never);
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const isLastPage = index === DATA.length - 1;

        const Content = (
            <View style={styles.contentOverlay}>
                <View style={styles.darkOverlay} />
                <View style={styles.safeContainer}>
                    <View style={styles.topEmptySpace} />

                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.subtitle}</Text>

                        {/* Pagination Indicator */}
                        <View style={styles.pagination}>
                            {DATA.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        currentIndex === i ? styles.activeDot : null
                                    ]}
                                />
                            ))}
                        </View>

                        <View style={styles.footer}>
                            {!isLastPage ? (
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                                        <Text style={styles.skipText}>Skip</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                                        <Text style={styles.nextBtnText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleNext} style={styles.getStartedBtn}>
                                    <Text style={styles.getStartedBtnText}>Get started</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );

        if (item.image) {
            return (
                <View style={styles.page}>
                    <ImageBackground
                        source={item.image}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    >
                        {Content}
                    </ImageBackground>
                </View>
            );
        }

        return (
            <View style={[styles.page, { backgroundColor: '#1A1A1A' }]}>
                {Content}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" style="light" />

            <FlatList
                ref={flatListRef}
                data={DATA}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
                scrollEventThrottle={16}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
    page: {
        width: width,
        height: screenHeight,
    },
    backgroundImage: {
        width: width,
        height: screenHeight,
    },
    contentOverlay: {
        flex: 1,
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    safeContainer: {
        flex: 1,
    },
    topEmptySpace: {
        flex: 12, // Moved up from 18 to 12
    },
    contentContainer: {
        paddingHorizontal: 25,
        paddingBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 42,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.9,
        marginBottom: 35,
        paddingHorizontal: 15,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 40,
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeDot: {
        width: 32,
        backgroundColor: '#FFFFFF',
    },
    footer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    skipBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    skipText: {
        color: '#FFB800',
        fontSize: 18,
        fontWeight: '600',
    },
    nextBtn: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 45,
        height: 48,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    getStartedBtn: {
        backgroundColor: '#FFB800',
        width: '100%',
        height: 48,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    getStartedBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
