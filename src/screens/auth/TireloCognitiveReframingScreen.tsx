import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    Alert,
    ActivityIndicator,
    Animated,
    Easing,
    Linking
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Rect } from 'react-native-svg';
import { chatService, authService } from '../../services/database';
import { geminiService } from '../../services/gemini';

const { width } = Dimensions.get('window');

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const LoadingAnimation = ({ color = '#FFF' }) => {
    const anim1 = useRef(new Animated.Value(0)).current;
    const anim2 = useRef(new Animated.Value(0)).current;
    const anim3 = useRef(new Animated.Value(0)).current;
    const anim4 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = (anim: Animated.Value) => Animated.sequence([
            Animated.timing(anim, {
                toValue: 1,
                duration: 120,
                // Expand
                useNativeDriver: false,
                easing: Easing.linear,
            }),
            Animated.timing(anim, {
                toValue: 0,
                duration: 480,
                // Contract
                useNativeDriver: false,
                easing: Easing.linear,
            }),
            Animated.delay(600) // Wait before next loop to match SVG timing
        ]);

        const startLoop = (anim: Animated.Value, delay: number) => {
            setTimeout(() => {
                Animated.loop(pulse(anim)).start();
            }, delay);
        };

        startLoop(anim1, 0);
        startLoop(anim2, 150);
        startLoop(anim3, 300);
        startLoop(anim4, 450);
    }, []);

    const renderRect = (anim: Animated.Value, baseX: number, baseY: number) => {
        const x = anim.interpolate({ inputRange: [0, 1], outputRange: [baseX, baseX - 1] });
        const y = anim.interpolate({ inputRange: [0, 1], outputRange: [baseY, baseY - 1] });
        const w = anim.interpolate({ inputRange: [0, 1], outputRange: [9, 11] });
        const h = anim.interpolate({ inputRange: [0, 1], outputRange: [9, 11] });

        return (
            <AnimatedRect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={color}
                rx="1"
            />
        );
    };

    return (
        <Svg width={80} height={80} viewBox="0 0 24 24">
            {renderRect(anim1, 1.5, 1.5)}
            {renderRect(anim2, 13.5, 1.5)}
            {renderRect(anim3, 13.5, 13.5)}
            {renderRect(anim4, 1.5, 13.5)}
        </Svg>
    );
};

const FormattedText = ({ text, style }: any) => {
    if (!text) return null;

    // Combined regex for bold, URLs, and phone numbers
    const parts = text.split(/(\*\*.*?\*\*|https?:\/\/[^\s]+|\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g);

    const handlePress = (onText: string, type: 'url' | 'tel') => {
        const url = type === 'tel' ? `tel:${onText.replace(/[^\d+]/g, '')}` : onText;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Error', `Cannot open: ${onText}`);
            }
        });
    };

    return (
        <Text style={style}>
            {parts.map((part: string, index: number) => {
                if (!part) return null;

                if (part.startsWith('**') && part.endsWith('**')) {
                    return <Text key={index} style={{ fontWeight: '900' }}>{part.slice(2, -2)}</Text>;
                }

                if (part.match(/https?:\/\/[^\s]+/)) {
                    return (
                        <Text
                            key={index}
                            style={{ color: '#007AFF', textDecorationLine: 'underline' }}
                            onPress={() => handlePress(part, 'url')}
                        >
                            {part}
                        </Text>
                    );
                }

                if (part.match(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/) && part.length > 8) {
                    return (
                        <Text
                            key={index}
                            style={{ color: '#007AFF', textDecorationLine: 'underline' }}
                            onPress={() => handlePress(part, 'tel')}
                        >
                            {part}
                        </Text>
                    );
                }

                return <Text key={index}>{part}</Text>;
            })}
        </Text>
    );
};

export default function TireloCognitiveReframingScreen() {
    const navigation = useNavigation();
    const [thought, setThought] = useState('');
    const [isReframing, setIsReframing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [sessionId, setSessionId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [initializing, setInitializing] = useState(true);
    const [submittedThought, setSubmittedThought] = useState('');
    const spinValue = React.useRef(new Animated.Value(0)).current;
    const scaleValue = React.useRef(new Animated.Value(1)).current;

    // Zoom Animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.05,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
            ).start();
        } else {
            spinValue.setValue(0);
        }
    }, [isLoading]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        initializeChat();
    }, []);

    const initializeChat = async () => {
        try {
            const { user } = await authService.getCurrentUser();
            if (user) {
                setUserId(user.id);

                // Create new session for today
                const sessionTitle = `Cognitive Reframing - ${new Date().toLocaleDateString()}`;
                const { data: session, error } = await chatService.createSession(user.id, sessionTitle);

                if (error) {
                    console.error('Error creating session:', error);
                    Alert.alert('Error', 'Failed to initialize chat session');
                    return;
                }

                if (session) {
                    setSessionId(session.id);

                    // Load existing messages
                    const { data: msgs } = await chatService.getMessages(session.id);
                    setMessages(msgs || []);
                }
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
        } finally {
            setInitializing(false);
        }
    };

    const handleSend = async () => {
        if (!thought.trim()) return;

        Keyboard.dismiss();
        setSubmittedThought(thought); // Save for display
        setIsLoading(true);
        setIsReframing(true);
        const userMessage = thought;
        setThought(''); // Clear input immediately

        try {
            // Ensure we have a session, if not try to initialize
            let currentSessionId = sessionId;
            let currentUserId = userId;

            if (!currentUserId || !currentSessionId) {
                const { user } = await authService.getCurrentUser();
                if (user) {
                    currentUserId = user.id;
                    setUserId(user.id);
                    const sessionTitle = `Cognitive Reframing - ${new Date().toLocaleDateString()}`;
                    const { data: session } = await chatService.createSession(user.id, sessionTitle);
                    if (session) {
                        currentSessionId = session.id;
                        setSessionId(session.id);
                    }
                }
            }

            // If we have database access, save the message
            if (currentSessionId && currentUserId) {
                await chatService.addMessage(currentSessionId, currentUserId, 'user', userMessage);
            }

            // Get AI response from Gemini
            const aiResponse = await geminiService.chat(userMessage, messages);

            // If we have database access, save the response
            if (currentSessionId && currentUserId) {
                await chatService.addMessage(currentSessionId, currentUserId, 'assistant', aiResponse);
                const { data: updatedMsgs } = await chatService.getMessages(currentSessionId);
                setMessages(updatedMsgs || []);
            }

            // Show the AI response
            setResult(aiResponse);
        } catch (error: any) {
            console.error('Error sending message:', error);
            // Fallback simulated response if AI/DB fails so the UI still works for the user
            setResult("I understand this is a difficult thought. Let's try to look at it from a different perspective. Remember that your thoughts are not always facts, and you have the strength to navigate through this.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color="#004b2c" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cognitive Reframing</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Background Circles and Robot */}
                    <View style={styles.robotContainer}>
                        <View style={[styles.circle, { width: width * 0.9, height: width * 0.9, opacity: 0.1 }]} />
                        <View style={[styles.circle, { width: width * 0.75, height: width * 0.75, opacity: 0.15 }]} />
                        <View style={[styles.circle, { width: width * 0.6, height: width * 0.6, opacity: 0.2 }]} />
                        <View style={[styles.circle, { width: width * 0.45, height: width * 0.45, opacity: 0.25 }]} />

                        <Animated.Image
                            source={require('../../../assets/images/newimages/Chat Icon.png')}
                            style={[styles.robotImage, { transform: [{ scale: scaleValue }] }]}
                            resizeMode="contain"
                        />
                    </View>

                    {!isReframing ? (
                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionText}>
                                Input a <Text style={styles.boldText}>Worry</Text> or <Text style={styles.boldText}>Negative</Text> thought and i will provide you with a <Text style={styles.boldText}>reframed</Text> perspective.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.resultsWrapper}>
                            {/* Your Thought Section */}
                            <Text style={styles.label}>
                                Your Thought
                            </Text>
                            <View style={styles.thoughtBox}>
                                <Text style={[styles.thoughtText, isLoading && { textAlign: 'center' }]}>
                                    {submittedThought}
                                </Text>
                            </View>

                            {/* Reframing/Result Section */}
                            <Text style={styles.label}>
                                {isLoading ? "Reframing" : "Reframed Perspective"}
                            </Text>
                            <View style={styles.resultBox}>
                                {isLoading ? (
                                    <View style={styles.loadingWrapper}>
                                        <LoadingAnimation color="#FFFFFF" />
                                    </View>
                                ) : (
                                    <FormattedText style={styles.resultText} text={result} />
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Footer Input Area */}
                <View style={styles.footer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Input thought here"
                            placeholderTextColor="#666"
                            value={thought}
                            onChangeText={setThought}
                            multiline
                        />
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <MaterialCommunityIcons name="send" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBEEF1', // Matches the clean light gray in images
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 45 : 15,
        paddingBottom: 15,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#D6E4E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#5C677D',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    robotContainer: {
        height: 350,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 1.2,
        borderColor: '#004b2c',
    },
    robotImage: {
        width: 250,
        height: 250,
    },
    instructionContainer: {
        marginTop: -10,
        width: '100%',
        paddingHorizontal: 15,
    },
    instructionText: {
        fontSize: 20,
        color: '#5C677D',
        textAlign: 'center',
        lineHeight: 30,
        fontWeight: '500',
    },
    boldText: {
        fontWeight: '900',
        color: '#004b2c',
    },
    resultsWrapper: {
        width: '100%',
        marginTop: -20,
    },
    label: {
        fontSize: 20,
        fontWeight: '900',
        color: '#5C677D',
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    thoughtBox: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#024d2c',
        padding: 22,
        marginBottom: 20,
        minHeight: 120,
        justifyContent: 'center',
        width: width * 0.92, // Expanded width
        alignSelf: 'center',
    },
    thoughtText: {
        fontSize: 16,
        color: '#5C677D',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
    },
    resultBox: {
        backgroundColor: '#004b2c',
        borderRadius: 15,
        padding: 25,
        minHeight: 150,
        justifyContent: 'center',
        width: width * 0.92, // Expanded width
        alignSelf: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    resultText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 26,
        fontWeight: '500',
    },
    loadingWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 8, // Reduced space under input
        paddingTop: 10,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    inputContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginRight: 15,
        paddingHorizontal: 20,
        justifyContent: 'center',
        height: 70,
    },
    input: {
        fontSize: 17,
        color: '#5C677D',
        fontWeight: '600',
    },
    sendButton: {
        width: 70,
        height: 70,
        borderRadius: 15,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
