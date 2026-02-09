import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { authService, profileService, chatService, checkupService } from '../../services/database';
import NewChatIcon from '../../components/NewChatIcon';
import EmptyChatHistoryIcon from '../../components/EmptyChatHistoryIcon';
import LearnQuestionIcon from '../../components/LearnQuestionIcon';
import OpenExercisesIcon from '../../components/OpenExercisesIcon';
import DailyCheckupModal from '../../components/DailyCheckupModal';
import NotificationsModal from '../../components/NotificationsModal';
import HomeNotificationIcon from '../../components/HomeNotificationIcon';

const { width } = Dimensions.get('window');

export default function TireloHomeScreen() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('User');
    const [chatSessions, setChatSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [todayMood, setTodayMood] = useState<string | null>(null);

    // Modal States
    const [dailyCheckupVisible, setDailyCheckupVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    const fetchUserData = async () => {
        try {
            const { user } = await authService.getCurrentUser();
            if (user) {
                // Load profile
                const { data: profile } = await profileService.getProfile(user.id);
                if (profile?.full_name) {
                    setUserName(profile.full_name.split(' ')[0]);
                } else {
                    setUserName(user.email?.split('@')[0] || 'User');
                }

                // Load recent chat sessions
                const { data: sessions } = await chatService.getSessions(user.id);
                if (sessions) {
                    setChatSessions(sessions.slice(0, 3)); // Show only 3 most recent
                }

                // Load today's checkup
                const { data: checkup } = await checkupService.getTodayCheckup(user.id);
                if (checkup) {
                    setTodayMood(checkup.mood); // Will settle to actual mood
                } else {
                    setTodayMood(null); // Reset if no checkup found (e.g. new day)
                    // If first load and no checkup, show modal
                    if (!initialCheckDone) {
                        setDailyCheckupVisible(true);
                        setInitialCheckDone(true);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left', 'top']}>
            <StatusBar style="dark" />

            <DailyCheckupModal
                visible={dailyCheckupVisible}
                onClose={() => setDailyCheckupVisible(false)}
                onComplete={() => {
                    setDailyCheckupVisible(false);
                    fetchUserData(); // Refresh to update mood
                }}
            />

            <NotificationsModal
                visible={notificationsVisible}
                onClose={() => setNotificationsVisible(false)}
            // Can pass notifications={[]} for now
            />

            <View style={styles.content}>

                {/* Header Row */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/images/newimages/LogoIcon.png')}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>naledi.<Text style={styles.logoTextAi}>ai</Text></Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
                            <HomeNotificationIcon size={28} color="#004b2c" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.learnButton}
                            onPress={() => navigation.navigate('TireloDailyWisdom' as any)}
                        >
                            <LearnQuestionIcon size={32} color="#004b2c" />
                            <Text style={styles.learnText}>Learn</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Greeting Banner */}
                    {/* Greeting Banner */}
                    <View style={styles.banner}>
                        {/* Background Circles */}
                        <View style={styles.bannerCircle1} />
                        <View style={styles.bannerCircle2} />

                        <View style={styles.bannerContent}>
                            <View style={styles.bannerText}>
                                <Text style={styles.greetingText}>Hello {userName}</Text>
                                <Text style={styles.bannerSubtext}>I hope you are well, it`s a great day isn`t it?</Text>
                                <View style={styles.bannerButtons}>
                                    <TouchableOpacity style={styles.checkUpBtn} onPress={() => setDailyCheckupVisible(true)}>
                                        <Text style={styles.checkUpBtnText}>Take Daily Check Up</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.noMoodBtn}>
                                        <Text style={styles.noMoodBtnText}>SAD</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Image
                                source={require('../../../assets/images/newimages/naledi (3) 1.png')}
                                style={styles.bannerRobot}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Popular Tasks */}
                    <Text style={styles.sectionTitle}>Popular Tasks</Text>
                    <View style={styles.tasksContainer}>
                        {/* Continue Chat - Vertical Box */}
                        <TouchableOpacity
                            style={styles.continueCard}
                            onPress={() => navigation.navigate('TireloCognitiveReframing' as never)}
                        >
                            <View style={styles.taskIconBg}>
                                <Image
                                    source={require('../../../assets/images/newimages/Property 1=Logo Anime 1.png')}
                                    style={styles.taskIconImage}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.continueText}>Would you like to continue your previous chat?</Text>
                            <View style={styles.continueBtn}>
                                <Text style={styles.continueBtnText}>Continue Chat</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.rightTasks}>
                            {/* Start New Chat */}
                            <TouchableOpacity
                                style={styles.smallCardGreen}
                                onPress={() => navigation.navigate('TireloCognitiveReframing' as never)}
                            >
                                <View style={styles.smallCardRow}>
                                    <NewChatIcon size={28} color="#FFFFFF" />
                                    <Ionicons name="arrow-forward" size={20} color="#004b2c" />
                                </View>
                                <Text style={styles.smallCardText}>Start a{"\n"}new chat</Text>
                            </TouchableOpacity>

                            {/* Open Exercises */}
                            <TouchableOpacity
                                style={styles.smallCardWhite}
                                onPress={() => navigation.navigate('TireloAffirmations' as never)}
                            >
                                <View style={styles.smallCardRow}>
                                    <View style={[styles.smallIconBg, { backgroundColor: '#004b2c' }]}>
                                        <OpenExercisesIcon size={24} color="#FFFFFF" />
                                    </View>
                                    <Ionicons name="arrow-forward" size={20} color="#666" />
                                </View>
                                <Text style={[styles.smallCardText, { color: '#333' }]}>Open{"\n"}Exercises</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Chat Session History Header */}
                    <View style={styles.sessionHeader}>
                        <Text style={styles.sectionTitle}>Chat Session History</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TireloChatHistory' as never)}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Show only the most recent Chat Session */}
                    <View style={styles.historySingleContainer}>
                        {chatSessions.length > 0 ? (
                            chatSessions.slice(0, 1).map((session) => (
                                <TouchableOpacity
                                    key={session.id}
                                    style={styles.sessionCard}
                                    onPress={() => navigation.navigate('TireloCognitiveReframing' as never)}
                                >
                                    <View style={styles.sessionIconBg}>
                                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.sessionInfo}>
                                        <Text style={styles.sessionTitleText}>{session.title}</Text>
                                        <Text style={styles.sessionDate}>
                                            {new Date(session.updated_at).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={20} color="#666" />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <EmptyChatHistoryIcon size={40} color="#CCC" />
                                <Text style={styles.emptyStateText}>No chat sessions yet</Text>
                                <Text style={styles.emptyStateSubtext}>Start a conversation to see your history</Text>
                            </View>
                        )}
                    </View>
                </ScrollView >

                {/* Custom Bottom Navigation Bar */}
                < View style={styles.bottomNavContainer} >
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => navigation.navigate('TireloAiChat' as never)}
                    >
                        <Image
                            source={require('../../../assets/images/newimages/Property 1=Logo Anime 1.png')}
                            style={styles.fabLogo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.navBar}>
                        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TireloHome' as never)}>
                            <Image
                                source={require('../../../assets/images/newimages/nav_home.png')}
                                style={styles.navIconImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('TireloCrisisSupport' as never)}
                        >
                            <Image
                                source={require('../../../assets/images/newimages/nav_history.png')}
                                style={styles.navIconImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('TireloAffirmations' as never)}
                        >
                            <Image
                                source={require('../../../assets/images/newimages/nav_exercises.png')}
                                style={styles.navIconImageSmall}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('TireloProfile' as never)}
                        >
                            <Image
                                source={require('../../../assets/images/newimages/nav_profile.png')}
                                style={styles.navIconImageSmall}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View >
            </View >
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 10, // Reduced height
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 40,
        height: 40,
    },
    navIconImage: {
        width: 24,
        height: 24,
    },
    navIconImageSmall: {
        width: 22,
        height: 20, // Reduced height for 3rd and 4th icons
    },
    taskIconImage: {
        width: 24,
        height: 24,
    },
    fabLogo: {
        width: 32,
        height: 32,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    logoTextAi: {
        color: '#004b2c',
    },
    learnButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    learnText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#004b2c',
        marginTop: -2,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 150,
    },
    banner: {
        backgroundColor: '#004b2c',
        borderRadius: 25,
        padding: 20,
        height: 180,
        marginBottom: 25,
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    bannerCircle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        right: -50,
        top: -50,
    },
    bannerCircle2: {
        position: 'absolute',
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        right: -20,
        top: -20,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 1,
    },
    bannerText: {
        flex: 1,
        paddingRight: 10,
    },
    greetingText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bannerSubtext: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    bannerButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    checkUpBtn: {
        backgroundColor: '#EBEEF2',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    checkUpBtnText: {
        color: '#004b2c',
        fontWeight: 'bold',
        fontSize: 12,
    },
    moodBtn: {
        backgroundColor: '#A2C14D',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    moodBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    noMoodBtn: {
        backgroundColor: '#A2C14D', // Changed to match "SAD" button style in image (Lime Green pill)
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        // Removed borders to match solid pill look
    },
    noMoodBtnText: {
        color: '#FFFFFF', // White text
        fontWeight: 'bold',
        fontSize: 12,
    },
    bannerRobot: {
        width: 130,
        height: 150,
        marginRight: -10,
        alignSelf: 'flex-end',
        marginBottom: -35,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 15,
    },
    tasksContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
    },
    continueCard: {
        flex: 1,
        backgroundColor: '#004b2c',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'space-between',
        height: 200,
    },
    taskIconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#A2C14D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
    continueBtn: {
        backgroundColor: '#EBEEF2',
        width: '100%',
        paddingVertical: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    continueBtnText: {
        color: '#004b2c',
        fontWeight: 'bold',
    },
    rightTasks: {
        flex: 1,
        gap: 15,
    },
    smallCardGreen: {
        backgroundColor: '#A2C14D',
        borderRadius: 20,
        padding: 15,
        height: 92,
        justifyContent: 'space-between',
    },
    smallCardWhite: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        height: 92,
        justifyContent: 'space-between',
    },
    smallCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallIconBg: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallCardText: {
        color: '#004b2c',
        fontSize: 15,
        fontWeight: 'bold',
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAll: {
        color: '#004b2c',
        fontWeight: 'bold',
    },
    sessionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sessionIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
        marginLeft: 15,
    },
    sessionTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sessionDate: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        paddingTop: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(224, 224, 224, 0.9)', // Match screen background color to mask
        flexDirection: 'row',
        alignItems: 'center',
    },
    fab: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 10,
    },
    navBar: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: 55,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 15,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#004b2c',
    },
    navItem: {
        padding: 5,
    },
    historySingleContainer: {
        marginBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        marginTop: 10,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#BBB',
        marginTop: 5,
    },
});
