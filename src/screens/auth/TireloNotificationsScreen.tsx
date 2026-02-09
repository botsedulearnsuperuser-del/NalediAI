import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function TireloNotificationsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const notificationsToday = [
        {
            id: 1,
            title: 'Appointment Reminder',
            description: 'Hi Krish, just a friendly reminder that your appointment with stylish John Doe is coming up tomorrow at 10:00 AM.',
            time: '11:00 AM',
            icon: 'calendar-outline',
            iconBg: '#FFF8E1'
        },
        {
            id: 2,
            title: 'VIP Member Exclusive!',
            description: 'Limited time: 30% off premium treatments this weekend! Book now and save big on our signature services.',
            time: '10:30 AM',
            icon: 'ribbon-outline',
            iconBg: '#FFF8E1'
        },
        {
            id: 3,
            title: 'New: Hydra-Glow Facial',
            description: 'Introducing our revolutionary 90-minute hydrating facial! Book now and be the first to experience glass skin perfection.',
            time: '09:00 AM',
            icon: 'sparkles-outline',
            iconBg: '#FFF8E1'
        }
    ];

    const notificationsYesterday = [
        {
            id: 4,
            title: 'Birthday Beauty Surprise!',
            description: "It's your special month! Enjoy a complimentary mini-mani with any service booking. 'coz you deserve to be pampered!",
            time: '03:30 PM',
            icon: 'gift-outline',
            iconBg: '#FFF8E1'
        },
        {
            id: 5,
            title: 'Share Your Glow!',
            description: 'Loved your recent visit? Help other beauties discover us! Leave a review and get 10% off your next appointment.',
            time: '02:00 PM',
            icon: 'heart-outline',
            iconBg: '#FFF8E1'
        },
        {
            id: 6,
            title: 'Meet Our Color Wizard!',
            description: 'Say hello to Alex, our newest color specialist! Expert in balayage & creative colors. Book to transform your look!',
            time: '10:00 AM',
            icon: 'star-outline',
            iconBg: '#FFF8E1'
        }
    ];

    const renderNotificationGroup = (title: string, data: any[]) => (
        <View style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.card}>
                {data.map((item, index) => (
                    <View key={item.id}>
                        <TouchableOpacity style={styles.notificationItem}>
                            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                                <Ionicons name={item.icon} size={22} color="#FFB800" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                                <Text style={styles.itemTime}>{item.time}</Text>
                            </View>
                        </TouchableOpacity>
                        {index < data.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <SafeAreaView style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? 50 : 0 }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderNotificationGroup('Today', notificationsToday)}
                {renderNotificationGroup('Yesterday', notificationsYesterday)}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Bottom Tabs */}
            <View style={[styles.bottomTabs, { paddingBottom: insets.bottom > 0 ? insets.bottom : 5, height: 50 + insets.bottom }]}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloHome' as never)}>
                    <Ionicons name="home" size={24} color="#FFB800" />
                    <Text style={[styles.tabText, { color: '#FFB800' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloExplore' as never)}>
                    <Ionicons name="search-outline" size={24} color="#666" />
                    <Text style={styles.tabText}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloOffers' as never)}>
                    <Ionicons name="pricetag-outline" size={24} color="#666" />
                    <Text style={styles.tabText}>Offers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloProfile' as never)}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                    <Text style={styles.tabText}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingBottom: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    scrollContent: {
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    groupContainer: {
        marginBottom: 25,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        paddingHorizontal: 15,
        // Elevation for android
        elevation: 2,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        paddingVertical: 15,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        marginBottom: 6,
    },
    itemTime: {
        fontSize: 12,
        color: '#999',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    bottomTabs: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
});
