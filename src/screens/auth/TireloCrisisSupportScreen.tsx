import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const SUPPORT_SERVICES = [
    {
        category: "Mental Health Support",
        items: [
            {
                name: "Botswana Association for Psychosocial Rehabilitation (BAPR)",
                time: "0900hrs - 1700hrs",
                address: "Block 3 Gaborone, Plot 16024",
                logo: "earth"
            },
            {
                name: "Botswana Network for Mental Health",
                time: "0900hrs - 1700hrs",
                address: "59851 Shorobe St, Gaborone",
                logo: "ribbon"
            }
        ]
    },
    {
        category: "Suicide and Emergency",
        items: [
            {
                name: "Lifeline - FTMTB Botswana Helpline",
                time: "0900hrs - 1700hrs",
                address: "Extension 12 Plot 3293",
                logo: "chatbubble-ellipses"
            },
            {
                name: "Botswana Association for Psychosocial Rehabilitation (BAPR)",
                time: "0900hrs - 1700hrs",
                address: "Block 3 Gaborone, Plot 16024",
                logo: "earth"
            }
        ]
    }
];

export default function TireloCrisisSupportScreen() {
    const navigation = useNavigation();

    const renderCard = (item: any) => (
        <View style={styles.card} key={item.name + Math.random()}>
            <View style={styles.cardIconBg}>
                {item.logo === 'earth' && <Ionicons name="earth" size={32} color="#4CAF50" />}
                {item.logo === 'ribbon' && <Ionicons name="ribbon" size={32} color="#4CAF50" />}
                {item.logo === 'chatbubble-ellipses' && <Ionicons name="chatbubble-ellipses" size={32} color="#2196F3" />}
            </View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardDetails}>{item.time}</Text>
            <Text style={styles.cardDetails}>{item.address}</Text>
            <TouchableOpacity style={styles.contactBtn}>
                <Text style={styles.contactBtnText}>Quick Contact</Text>
            </TouchableOpacity>
        </View>
    );

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
                <Text style={styles.headerTitle}>Crisis&Support</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerTextContainer}>
                        <View style={styles.powerIconBg}>
                            <MaterialCommunityIcons name="power" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.bannerText}>
                            Resources and Contacts for Human interaction and Intevention
                        </Text>
                    </View>
                    <Image
                        source={require('../../../assets/images/newimages/Chat Icon.png')}
                        style={styles.bannerRobot}
                        resizeMode="contain"
                    />
                </View>

                {SUPPORT_SERVICES.map((section) => (
                    <View key={section.category} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.category}</Text>
                        <View style={styles.cardsGrid}>
                            {section.items.map(renderCard)}
                        </View>
                    </View>
                ))}
            </ScrollView>
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
        paddingBottom: 20,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 30,
    },
    banner: {
        backgroundColor: '#C8E6C9',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        height: 140,
    },
    bannerTextContainer: {
        flex: 1,
    },
    powerIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    bannerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1B5E20',
        lineHeight: 20,
    },
    bannerRobot: {
        width: 90,
        height: 110,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 15,
        marginLeft: 5,
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: (width - 45) / 2,
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 220,
    },
    cardIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1B5E20',
        textAlign: 'center',
        marginBottom: 8,
    },
    cardDetails: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    contactBtn: {
        backgroundColor: '#004b2c',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginTop: 15,
        width: '100%',
    },
    contactBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fab: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
        width: 40,
        height: 40,
    },
    navBar: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: 70,
        borderRadius: 35,
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
        width: 32,
        height: 32,
    }
});
