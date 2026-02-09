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
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import DailyMentalExerciseIcon from '../../components/DailyMentalExerciseIcon';

const { width } = Dimensions.get('window');

export default function TireloResourcesScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/images/newimages/Property 1=Logo Anime 1.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>naledi.<Text style={styles.logoTextAi}>ai</Text></Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={28} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.screenTitle}>Resources Center</Text>

                {/* Top Options Row */}
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.greenCard} onPress={() => navigation.navigate('TireloSaveMe' as never)}>
                        <View style={styles.iconCircle}>
                            <DailyMentalExerciseIcon size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.cardText}>Save Me</Text>
                        <Text style={styles.cardSubText}>Alert Authorities and shared contacts</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.arrowIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.lightCard} onPress={() => navigation.navigate('TireloCrisisSupport' as never)}>
                        <View style={styles.iconCircleLight}>
                            <Ionicons name="power" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.cardTextDark}>Connections & Crisis Support</Text>
                        <Ionicons name="arrow-forward" size={20} color="#333" style={styles.arrowIcon} />
                    </TouchableOpacity>
                </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.brainIconContainer}>
                        <MaterialCommunityIcons name="brain" size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.statsText}>
                        You have done <Text style={styles.boldGreen}>13</Text> mental exercise sessions this week
                    </Text>
                </View>

                {/* Available Exercises */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Available Exercises</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {/* Exercise 1 - Cognitive Reframing */}
                <View style={styles.exerciseCard}>
                    <View style={styles.exerciseBgOverlay} />
                    <View style={styles.exerciseContent}>
                        <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('TireloCognitiveReframing' as never)}>
                            <Text style={styles.playText}>Play</Text>
                        </TouchableOpacity>
                        <Text style={styles.exerciseTitle}>Cognitive Reframing</Text>
                        <Text style={styles.exerciseDesc}>Input a worry or negative thought, and <Text style={styles.boldText}>Naledi</Text> will suggest reframed perspectives.</Text>
                    </View>
                </View>

                {/* Exercise 2 - Affirmations */}
                <View style={styles.exerciseCard}>
                    <View style={styles.exerciseBgOverlay} />
                    <View style={styles.exerciseContent}>
                        <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('TireloAffirmations' as never)}>
                            <Text style={styles.playText}>Play</Text>
                        </TouchableOpacity>
                        <Text style={styles.exerciseTitle}>Daily Affirmations</Text>
                        <Text style={styles.exerciseDesc}>Description of a mental exercise will be showned</Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNavContainer}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('TireloCognitiveReframing' as never)}
                >
                    <Image
                        source={require('../../../assets/images/newimages/Property 1=Logo Anime 1.png')}
                        style={styles.fabLogo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.navBar}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => navigation.navigate('TireloHome' as never)}
                    >
                        <Image
                            source={require('../../../assets/images/newimages/nav_home.png')}
                            style={styles.navIconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* History / Crisis Configured as per Profile Screen */}
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => navigation.navigate('TireloChatHistory' as never)}
                    >
                        <Image
                            source={require('../../../assets/images/newimages/nav_history.png')}
                            style={styles.navIconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Resources (Current) */}
                    <TouchableOpacity
                        style={styles.navItem}
                    // Already here
                    >
                        <Image
                            source={require('../../../assets/images/newimages/nav_exercises.png')}
                            style={[styles.navIconImageSmall, { tintColor: '#004b2c' }]} // Active tint
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 30,
        height: 30,
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    logoTextAi: {
        color: '#004b2c',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    greenCard: {
        backgroundColor: '#004b2c',
        width: (width - 50) / 2,
        borderRadius: 20,
        padding: 15,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    lightCard: {
        backgroundColor: '#C8E6C9', // Light green
        width: (width - 50) / 2,
        borderRadius: 20,
        padding: 15,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleLight: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cardSubText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        marginBottom: 5,
        flex: 1,
    },
    cardTextDark: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        flex: 1,
    },
    arrowIcon: {
        alignSelf: 'flex-end',
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: '#004b2c',
        marginBottom: 25,
        alignItems: 'center',
    },
    brainIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00CB5D', // Bright green for brain icon
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
        lineHeight: 22,
        fontWeight: '500',
    },
    boldGreen: {
        color: '#004b2c',
        fontWeight: 'bold',
        fontSize: 18,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00CB5D',
    },
    exerciseCard: {
        backgroundColor: '#E0EAE4', // Lightish background
        borderRadius: 20,
        padding: 20,
        paddingBottom: 25,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#004b2c',
        overflow: 'hidden',
    },
    exerciseBgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // Add some subtle pattern/lines if possible, or just transparent
        opacity: 0.1,
    },
    exerciseContent: {
        zIndex: 2,
    },
    playButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#004b2c',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        zIndex: 10,
    },
    playText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    exerciseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004b2c',
        marginTop: 35, // Space for play button
        marginBottom: 8,
    },
    exerciseDesc: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },

    // Bottom Nav Styles
    bottomNavContainer: {
        position: 'absolute',
        bottom: 5,
        left: 10,
        right: 10,
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
    fabLogo: {
        width: 32,
        height: 32,
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
    navIconImage: {
        width: 24,
        height: 24,
    },
    navIconImageSmall: {
        width: 22,
        height: 20,
    },
});
