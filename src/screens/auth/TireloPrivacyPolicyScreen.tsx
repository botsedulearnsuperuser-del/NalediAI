import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function TireloPrivacyPolicyScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.logoText}>TIRELO</Text>
                    <Text style={styles.tagline}>BEAUTY <Text style={styles.dot}>•</Text> STYLE <Text style={styles.dot}>•</Text> LUXURY</Text>
                </View>

                <Text style={styles.title}>Privacy Policy</Text>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={styles.paragraph}>
                        1. Data Collection: We collect information you provide when creating an account, such as name, email, and preferences.
                    </Text>
                    <Text style={styles.paragraph}>
                        2. Use of Data: Your data is used to personalize your luxury experience, manage bookings, and send relevant offers.
                    </Text>
                    <Text style={styles.paragraph}>
                        3. Data Security: We implement industry-standard security measures to protect your personal information from unauthorized access.
                    </Text>
                    <Text style={styles.paragraph}>
                        4. Third-Party Sharing: We do not sell your data. We only share information with our trusted salon partners to fulfill your bookings.
                    </Text>
                    <Text style={styles.paragraph}>
                        5. Your Rights: You can request access, correction, or deletion of your personal data at any time through the app settings.
                    </Text>
                    <Text style={styles.paragraph}>
                        6. Policy Updates: We may update this policy periodically. We will notify you of any significant changes via the app.
                    </Text>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.disclaimer}>
                        By continuing to use the Tirelo app, you acknowledge that you have read and agree to this Privacy Policy.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 0,
    },
    backButton: {
        marginTop: 50,
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 20,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '400',
        color: '#DAB24E',
        fontFamily: Platform.OS === 'ios' ? 'Optima' : 'serif',
        letterSpacing: 4,
    },
    tagline: {
        fontSize: 9,
        letterSpacing: 2,
        color: '#DAB24E',
        marginTop: 5,
        fontWeight: '700',
    },
    dot: {
        fontSize: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    paragraph: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 15,
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginBottom: 20,
    },
    disclaimer: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 18,
    },
});
