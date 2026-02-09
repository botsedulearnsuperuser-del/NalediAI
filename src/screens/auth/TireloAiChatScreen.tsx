import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Keyboard,
    Alert,
    ActivityIndicator,
    Linking,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    Animated,
    Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import * as NavigationBar from 'expo-navigation-bar';

import { chatService, authService } from '../../services/database';
import { geminiService } from '../../services/gemini';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LoadingAnimation = ({ color = '#FFF' }) => {
    const anim1 = useRef(new Animated.Value(0)).current;
    const anim2 = useRef(new Animated.Value(0)).current;
    const anim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = (anim: Animated.Value) => Animated.sequence([
            Animated.timing(anim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.bezier(0.33, 1, 0.68, 1), // approximates Spline
            }),
            Animated.timing(anim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.bezier(0.33, 1, 0.68, 1),
            })
        ]);

        const startLoop = (anim: Animated.Value, delay: number) => {
            setTimeout(() => {
                Animated.loop(pulse(anim)).start();
            }, delay);
        };

        // Delays from SVG: 0s, 0.1s, 0.2s
        startLoop(anim1, 0);
        startLoop(anim2, 100);
        startLoop(anim3, 200);
    }, []);

    const renderCircle = (anim: Animated.Value, cx: number) => {
        const cy = anim.interpolate({ inputRange: [0, 1, 2], outputRange: [12, 6, 12] });

        // We can't easily animate cy directly with native driver in Svg on all versions, 
        // but react-native-svg supports Animated components. 
        // NOTE: 'cy' prop animation might require useNativeDriver: false if not supported.
        // Let's stick to simple Y translation or just use the animated props

        return (
            <AnimatedCircle
                cx={cx}
                cy={cy}
                r="3"
                fill={color}
            />
        );
    };

    return (
        <Svg width={24} height={24} viewBox="0 0 24 24">
            {renderCircle(anim1, 4)}
            {renderCircle(anim2, 12)}
            {renderCircle(anim3, 20)}
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

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export default function TireloAiChatScreen() {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [initializing, setInitializing] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        initializeChat();
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync('#FFFFFF');
            NavigationBar.setButtonStyleAsync('dark');
        }
    }, []);

    const initializeChat = async () => {
        try {
            const { user } = await authService.getCurrentUser();
            if (user) {
                setUserId(user.id);
                const sessionTitle = `Chat Session - ${new Date().toLocaleDateString()}`;
                const { data: session } = await chatService.createSession(user.id, sessionTitle);
                if (session) {
                    setSessionId(session.id);
                    const { data: msgs } = await chatService.getMessages(session.id);
                    if (msgs && msgs.length > 0) {
                        setMessages(msgs.map(m => ({
                            id: m.id,
                            text: m.content || '',
                            sender: m.role === 'user' ? 'user' : 'ai',
                            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        })));
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
        } finally {
            setInitializing(false);
        }
    };

    const handleSend = async () => {
        if (message.trim() === '') return;

        const userText = message;
        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMessage]);
        setMessage('');
        setIsTyping(true);
        Keyboard.dismiss();

        try {
            let currentSessionId = sessionId;
            let currentUserId = userId;

            if (!currentUserId || !currentSessionId) {
                const { user } = await authService.getCurrentUser();
                if (user) {
                    currentUserId = user.id;
                    setUserId(user.id);
                    const { data: session } = await chatService.createSession(user.id, "Auto Session");
                    if (session) {
                        currentSessionId = session.id;
                        setSessionId(session.id);
                    }
                }
            }

            if (currentSessionId && currentUserId) {
                await chatService.addMessage(currentSessionId, currentUserId, 'user', userText);
            }

            // Get real Gemini AI response
            const historyForAi = messages.map(m => ({
                role: m.sender,
                content: m.text
            }));

            const aiResponseText = await geminiService.chat(userText, historyForAi);

            if (currentSessionId && currentUserId) {
                await chatService.addMessage(currentSessionId, currentUserId, 'assistant', aiResponseText);
            }

            const aiResponse: Message = {
                id: Date.now().toString(),
                text: aiResponseText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isTyping]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Chat</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.deleteIndicator}>
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFF" />
                        <Text style={styles.deleteText}>Delete?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="dots-vertical" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                {messages.length === 0 && !isTyping ? (
                    /* Initial State */
                    <View style={styles.initialContainer}>
                        <View style={styles.robotCircleContainer}>
                            <View style={styles.greenCircle} />
                            <Image
                                source={require('../../../assets/images/newimages/naledi (3) 1.png')}
                                style={styles.largeRobot}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.welcomeText}>
                            Hi, I'm <Text style={styles.boldText}>Naledi</Text>,
                        </Text>
                        <Text style={styles.subWelcomeText}>
                            Your <Text style={styles.boldText}>AI</Text> Mental Health Companion
                        </Text>
                    </View>
                ) : (
                    /* Chat State */
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.chatScroll}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((msg) => (
                            <View key={msg.id} style={styles.messageRow}>
                                {msg.sender === 'user' ? (
                                    <View style={styles.userMessageContainer}>
                                        <View style={styles.userBubble}>
                                            <Text style={styles.userText}>{msg.text}</Text>
                                        </View>
                                        <Text style={styles.timestamp}>{msg.timestamp}</Text>
                                    </View>
                                ) : (
                                    <View style={styles.aiMessageContainer}>
                                        <View style={styles.aiRow}>
                                            <View style={styles.avatarContainer}>
                                                <Image
                                                    source={require('../../../assets/images/newimages/naledi (3) 1.png')}
                                                    style={styles.avatar}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <View style={styles.aiBubble}>
                                                <FormattedText style={styles.aiText} text={msg.text} />
                                            </View>
                                        </View>
                                        <Text style={[styles.timestamp, { marginLeft: 55 }]}>{msg.timestamp}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                        {isTyping && (
                            <View style={styles.aiMessageContainer}>
                                <View style={styles.typingBubble}>
                                    <LoadingAnimation color="#FFF" />
                                </View>
                            </View>
                        )}
                    </ScrollView>
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Talk to me about anything"
                        placeholderTextColor="#7D8A99"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBEEF2', // Lighter, cleaner background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: Platform.OS === 'android' ? 45 : 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D6E4E0', // Light green background
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5C677D',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    deleteIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#004b2c',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 12,
        marginRight: 10,
    },
    deleteText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    initialContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    robotCircleContainer: {
        width: 280,
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    greenCircle: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: '#004b2c',
    },
    largeRobot: {
        width: 220,
        height: 220,
    },
    welcomeText: {
        fontSize: 24,
        color: '#5C677D',
        textAlign: 'center',
    },
    subWelcomeText: {
        fontSize: 20,
        color: '#5C677D',
        textAlign: 'center',
        marginTop: 8,
    },
    boldText: {
        fontWeight: '900',
        color: '#004b2c',
    },
    chatScroll: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
        paddingBottom: 40,
    },
    messageRow: {
        marginBottom: 25,
    },
    userMessageContainer: {
        alignItems: 'flex-end',
        width: '100%',
    },
    userBubble: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        borderBottomRightRadius: 2,
        maxWidth: '85%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userText: {
        fontSize: 16,
        color: '#7D8A99',
        lineHeight: 24,
    },
    aiMessageContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    aiRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#074c2c',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 10,
    },
    avatar: {
        width: 35,
        height: 35,
    },
    aiBubble: {
        backgroundColor: '#004b2c',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        borderBottomLeftRadius: 2,
        maxWidth: '80%',
    },
    aiText: {
        fontSize: 16,
        color: '#FFF',
        lineHeight: 24,
    },
    typingBubble: {
        backgroundColor: '#004b2c',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 15,
        marginLeft: 57,
        marginTop: -10,
    },
    timestamp: {
        fontSize: 13,
        color: '#5C677D',
        marginTop: 8,
        marginHorizontal: 5,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 18,
        fontSize: 16,
        color: '#333',
        maxHeight: 120,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sendButton: {
        width: 70,
        height: 70,
        borderRadius: 15,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
});
