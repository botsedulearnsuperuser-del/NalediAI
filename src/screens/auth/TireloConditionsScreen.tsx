import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TireloConditionsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
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

                <Text style={styles.title}>Conditions of Use</Text>



                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={styles.paragraph}>
                        1. Service Availability: We provide salon and beauty service bookings. Availability depends on local partners.
                    </Text>
                    <Text style={styles.paragraph}>
                        2. Booking Policy: All bookings are subject to confirmation. Please arrive 10 minutes prior to your appointment.
                    </Text>
                    <Text style={styles.paragraph}>
                        3. Cancellation: Cancellations made within 2 hours of the appointment may incur a small fee.
                    </Text>
                    <Text style={styles.paragraph}>
                        4. User Conduct: We maintain a premium environment. Users are expected to treat stylists and other customers with respect.
                    </Text>
                    <Text style={styles.paragraph}>
                        5. Payment: Payments are processed securely. Any disputes should be reported within 24 hours.
                    </Text>
                    <Text style={styles.paragraph}>
                        6. Luxury Standards: Tirelo ensures that all partners maintain the highest hygiene and quality levels.
                    </Text>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.disclaimer}>
                        By continuing to use the Tirelo app, you acknowledge that you have read and agree to these Conditions of Use.
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
        marginTop: 40,
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
