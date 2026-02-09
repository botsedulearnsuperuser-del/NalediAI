import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const WISDOM_CARDS = [
    { title: 'Technique: Positive Anchoring', content: 'Identify a moment of pure joy from your past. Close your eyes and relive it.', icon: 'anchor', color: '#A2C14D' },
    { title: 'Mastering Positive Emotions', content: 'Gratitude is the gateway to greatness. Write down three things you are grateful for today.', icon: 'heart-pulse', color: '#004b2c' },
    { title: 'Always Strive for Greatness', content: 'Your mind is the master of your destiny. Challenge one negative thought today.', icon: 'crown', color: '#FFD700' },
    { title: 'Mentality Fit: The 1% Rule', content: 'Don\'t try to change everything at once. Just aim to be 1% better than yesterday.', icon: 'brain', color: '#87CEEB' },
    { title: 'Growth Mindset', content: 'Embrace challenges as opportunities to learn and evolve.', icon: 'seed', color: '#004b2c' },
    { title: 'Morning Ritual', content: 'Start your day with intention and clarity for peak performance.', icon: 'weather-sunny', color: '#A2C14D' },
    { title: 'Self-Reflection', content: 'Regular introspection leads to profound personal breakthroughs.', icon: 'mirror', color: '#FFD700' },
    { title: 'Daily Gratitude', content: 'Acknowledge the abundance in your life to attract more of it.', icon: 'hand-heart', color: '#87CEEB' }
];

export default function TireloDailyWisdomScreen() {
    const navigation = useNavigation();

    const openWisdom = (wisdom: any) => {
        navigation.navigate('TireloDailyWisdomDetail' as any, { wisdom } as any);
    };

    // Group cards in sets of 4 (2x2)
    const cardPages = [
        WISDOM_CARDS.slice(0, 4),
        WISDOM_CARDS.slice(4, 8)
    ];

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
                <Text style={styles.headerTitle}>Daily Wisdom</Text>
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.banner}>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>Message of the Day</Text>
                        <Text style={styles.bannerText}>
                            "Success is not final, failure is not fatal: it is the courage to continue that counts."
                        </Text>
                    </View>
                    <Image
                        source={require('../../../assets/images/newimages/Chat Icon.png')}
                        style={styles.bannerRobot}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeading}>Wisdom for Greatness</Text>
                    <View style={styles.swipeHint}>
                        <Text style={styles.swipeHintText}>Swipe left</Text>
                        <Ionicons name="arrow-back" size={14} color="#004b2c" />
                    </View>
                </View>

                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pagedScrollContent}
                >
                    {cardPages.map((pageCards, pageIndex) => (
                        <View key={pageIndex} style={styles.gridPage}>
                            {pageCards.map((card, index) => (
                                <View key={`${pageIndex}-${index}`} style={styles.gridCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.miniIconBg}>
                                            <MaterialCommunityIcons name={card.icon as any} size={18} color="#004b2c" />
                                        </View>
                                        <Text style={styles.gridCardTitle} numberOfLines={1}>{card.title}</Text>
                                    </View>
                                    <Text style={styles.gridCardDesc} numberOfLines={3}>{card.content}</Text>
                                    <TouchableOpacity
                                        style={styles.miniReadMore}
                                        onPress={() => openWisdom(card)}
                                    >
                                        <Text style={styles.miniReadMoreText}>Read More</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('TireloResources' as never)}
                >
                    <Text style={styles.actionButtonText}>Resources Center</Text>
                </TouchableOpacity>
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    banner: {
        backgroundColor: '#004b2c',
        borderRadius: 25,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
        minHeight: 140,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        color: '#A2C14D',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    bannerText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 22,
    },
    bannerRobot: {
        width: 80,
        height: 80,
        marginLeft: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginBottom: 15,
        marginTop: 20,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    swipeHint: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
    swipeHintText: {
        fontSize: 12,
        color: '#004b2c',
        marginRight: 4,
        fontWeight: '600',
    },
    pagedScrollContent: {
        paddingVertical: 10,
    },
    gridPage: {
        width: width - 40,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        backgroundColor: '#FFFFFF',
        width: (width - 40 - 15) / 2,
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        justifyContent: 'space-between',
        minHeight: 180, // Increased height
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    miniIconBg: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: 'rgba(0, 75, 44, 0.1)', // Light brand color background
    },
    gridCardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    gridCardDesc: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        marginBottom: 12,
    },
    miniReadMore: {
        alignSelf: 'center',
        width: '100%',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        alignItems: 'center',
    },
    miniReadMoreText: {
        fontSize: 12,
        color: '#004b2c',
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: '#004b2c',
        width: '100%',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    readMoreBtn: {
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#F0F5F2',
        borderRadius: 10,
    },
    readMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#004b2c',
    },
});
