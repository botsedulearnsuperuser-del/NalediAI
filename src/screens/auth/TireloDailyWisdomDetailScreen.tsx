import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
    Animated,
    PanResponder,
    ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function TireloDailyWisdomDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { wisdom }: any = route.params || {};
    const [cardIndex, setCardIndex] = useState(0);
    const pan = useRef(new Animated.ValueXY()).current;

    if (!wisdom) return null;

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const SLIDES = [
        {
            type: 'intro',
            title: wisdom.title,
            content: wisdom.content,
        },
        {
            type: 'content',
            title: 'How to perform',
            details: "1. Find a quiet space where you won't be disturbed.\n2. Breathe deeply for 5 seconds, filling your lungs with fresh energy.\n3. Focus on the core feeling of the technique, visualizing its impact.\n4. Apply it directly to a specific situation you encounter today.",
        },
        {
            type: 'tip',
            title: 'Mastery Tip',
            content: "Don't rush the process. True mentality shifts happen when you are consistently gentle with yourself. If your mind wanders, acknowledge it and refocus on the greatness you strive for.",
        },
        {
            type: 'action',
            title: 'Action Steps',
            content: "• Practice this 3 times today.\n• Write down how you felt after applying it.\n• Share this technique with someone else to solidify your own understanding.",
        },
        {
            type: 'importance',
            title: 'Why This Matters',
            content: "Mastering this technique helps brain plasticity and builds long-term mental resilience. By consistently practicing positive reframing, you are training your mind to strive for greatness.",
        },
        {
            type: 'quiz',
            title: 'Quick Check',
            question: "What is the most important aspect of mastering this technique?",
            options: [
                { id: 'a', text: 'Doing it perfectly the first time', correct: false },
                { id: 'b', text: 'Being consistently gentle with yourself', correct: true },
                { id: 'c', text: 'Rushing through the steps', correct: false },
                { id: 'd', text: 'Only practicing when you feel good', correct: false }
            ]
        },
        {
            type: 'encouragement',
            title: 'Ready for Greatness!',
            content: "Thank you for taking this time to grow. Your dedication to mental excellence is what sets you apart. Keep striving, keep learning, and remember: greatness is within you!",
            button: true
        }
    ];

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy < -100) {
                    // Swipe up
                    Animated.timing(pan, {
                        toValue: { x: 0, y: -height },
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        if (cardIndex < SLIDES.length - 1) {
                            setCardIndex(cardIndex + 1);
                            pan.setValue({ x: 0, y: 0 });
                            // Reset answer for next quiz
                            if (SLIDES[cardIndex + 1]?.type === 'quiz') {
                                setSelectedAnswer(null);
                            }
                        }
                    });
                } else {
                    // Snap back
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const renderCard = (slide: any, index: number) => {
        const isCurrent = index === cardIndex;
        // Stacked effect for background cards
        const offset = (index - cardIndex) * 8;
        const opacity = isCurrent ? 1 : Math.max(0, 1 - (index - cardIndex) * 0.3);

        const animatedStyle = isCurrent
            ? { transform: pan.getTranslateTransform() }
            : {
                transform: [{ translateY: offset }, { scale: 1 - (index - cardIndex) * 0.05 }],
                left: offset / 2, // Book page effect shift
            };

        return (
            <Animated.View
                key={index}
                style={[
                    styles.cardWrapper,
                    animatedStyle,
                    { zIndex: SLIDES.length - index, opacity: opacity }
                ]}
                {...(isCurrent && slide.type !== 'encouragement' ? panResponder.panHandlers : {})}
            >
                <View style={styles.cardContent}>
                    {/* Visual "Stack" indicator on left */}
                    {index > cardIndex && <View style={styles.stackIndicator} />}

                    <View style={styles.cardInner}>
                        <Text style={styles.slideHeader}>{slide.title}</Text>
                        <View style={styles.divider} />

                        {slide.type === 'intro' && (
                            <>
                                <Text style={styles.introContent}>{slide.content}</Text>
                            </>
                        )}

                        {slide.type === 'content' && (
                            <>
                                <Text style={styles.detailsText}>{slide.details}</Text>
                            </>
                        )}

                        {(slide.type === 'tip' || slide.type === 'action' || slide.type === 'importance') && (
                            <>
                                <Text style={styles.contentText}>{slide.content}</Text>
                            </>
                        )}

                        {slide.type === 'quiz' && (
                            <>
                                <Text style={styles.quizQuestion}>{slide.question}</Text>
                                <View style={styles.optionsContainer}>
                                    {slide.options.map((option: any) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[
                                                styles.optionButton,
                                                selectedAnswer === option.id && (option.correct ? styles.correctOption : styles.incorrectOption)
                                            ]}
                                            onPress={() => setSelectedAnswer(option.id)}
                                            disabled={selectedAnswer !== null}
                                        >
                                            <View style={styles.optionCircle}>
                                                <Text style={styles.optionId}>{option.id.toUpperCase()}</Text>
                                            </View>
                                            <Text style={[
                                                styles.optionText,
                                                selectedAnswer === option.id && styles.optionTextSelected
                                            ]}>{option.text}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {selectedAnswer && (
                                    <View style={styles.feedbackContainer}>
                                        <Text style={styles.feedbackText}>
                                            {slide.options.find((o: any) => o.id === selectedAnswer)?.correct
                                                ? "✓ Excellent! You're on the path to greatness."
                                                : "Not quite. The key is being gentle and consistent with yourself."}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}

                        {slide.type === 'encouragement' && (
                            <>
                                <Text style={styles.encouragementText}>{slide.content}</Text>
                                <TouchableOpacity
                                    style={styles.doneBtn}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={styles.doneBtnText}>Complete Mastery</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {slide.type !== 'encouragement' && slide.type !== 'quiz' && (
                            <View style={styles.swipeUpHint}>
                                <Ionicons name="chevron-up" size={24} color="#004b2c" />
                                <Text style={styles.swipeUpText}>Swipe up to continue</Text>
                            </View>
                        )}

                        {slide.type === 'quiz' && selectedAnswer && (
                            <View style={styles.swipeUpHint}>
                                <Ionicons name="chevron-up" size={24} color="#004b2c" />
                                <Text style={styles.swipeUpText}>Swipe up to finish</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#004b2c" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mastery Lesson</Text>
                <View style={{ width: 36 }} />
            </View>

            {/* Always Strive for Greatness Sub-header */}
            <View style={styles.greatnessSection}>
                <Text style={styles.greatnessTitle}>Always Strive for Greatness</Text>
                <Text style={styles.greatnessSubtitle}>
                    Your mind is the master of your destiny. Challenge yourself to be 1% better every single day.
                </Text>
            </View>

            <View style={styles.stackContainer}>
                {/* Show current and next two slides for stack effect */}
                {[...Array(SLIDES.length)].map((_, i) => {
                    if (i < cardIndex || i > cardIndex + 2) return null;
                    return renderCard(SLIDES[i], i);
                }).reverse()}
            </View>

            {/* Vertical Pagination Dots on the right */}
            <View style={styles.pagination}>
                {SLIDES.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            cardIndex === i ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 15,
        zIndex: 100,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#CDE1D8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    greatnessSection: {
        paddingHorizontal: 25,
        paddingTop: 10,
        paddingBottom: 5,
    },
    greatnessTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#004b2c',
        marginBottom: 8,
    },
    greatnessSubtitle: {
        fontSize: 15,
        color: '#444',
        fontStyle: 'italic',
        lineHeight: 22,
    },
    stackContainer: {
        flex: 1,
        position: 'relative',
        marginTop: 0,
    },
    cardWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 15,
        justifyContent: 'center',
    },
    cardContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        height: '75%',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    stackIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        backgroundColor: 'rgba(0, 75, 44, 0.1)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.05)',
    },
    cardInner: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    introContent: {
        fontSize: 16,
        color: '#444',
        textAlign: 'left', // Professional layout
        lineHeight: 24,
        marginBottom: 20,
        width: '100%',
    },
    slideHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004b2c',
        marginBottom: 15,
        textAlign: 'center',
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: '#A2C14D',
        borderRadius: 2,
        marginBottom: 25,
        alignSelf: 'center',
    },
    contentText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 26,
        textAlign: 'left',
        width: '100%',
    },
    detailsText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        textAlign: 'left',
        width: '100%',
    },
    quizQuestion: {
        fontSize: 17,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 24,
    },
    optionsContainer: {
        width: '100%',
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    correctOption: {
        backgroundColor: 'rgba(162, 193, 77, 0.15)',
        borderColor: '#A2C14D',
    },
    incorrectOption: {
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        borderColor: '#FF6B6B',
    },
    optionCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionId: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    optionTextSelected: {
        fontWeight: '600',
    },
    feedbackContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: 'rgba(162, 193, 77, 0.1)',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#A2C14D',
    },
    feedbackText: {
        fontSize: 15,
        color: '#004b2c',
        fontWeight: '600',
        textAlign: 'center',
    },
    encouragementText: {
        fontSize: 18,
        color: '#444',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    swipeUpHint: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        opacity: 0.6,
    },
    swipeUpText: {
        color: '#004b2c',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 5,
    },
    pagination: {
        position: 'absolute',
        right: 25,
        top: '45%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 101,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginVertical: 4,
    },
    activeDot: {
        backgroundColor: '#004b2c',
        height: 20,
    },
    inactiveDot: {
        backgroundColor: 'rgba(0, 75, 44, 0.2)',
    },
    doneBtn: {
        backgroundColor: '#004b2c',
        width: '100%',
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    doneBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
