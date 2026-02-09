import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TireloTermsScreen() {
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

                <Text style={styles.title}>Terms and Conditions</Text>



                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={styles.paragraph}>
                        1. Introduction: Welcome to Tirelo. By using our services, you agree to these terms.
                    </Text>
                    <Text style={styles.paragraph}>
                        2. Use of Services: You must use our services for lawful purposes only and in a way that does not infringe on the rights of others.
                    </Text>
                    <Text style={styles.paragraph}>
                        3. Privacy Policy: Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your data.
                    </Text>
                    <Text style={styles.paragraph}>
                        4. Account Luxury: We strive to provide the most luxurious experience. Any misuse of the account may lead to suspension.
                    </Text>
                    <Text style={styles.paragraph}>
                        5. Beauty Standards: Our services are designed to meet the highest beauty and style standards in the industry.
                    </Text>
                    <Text style={styles.paragraph}>
                        6. Liability: Tirelo is not liable for any indirect or consequential loss arising from your use of the app.
                    </Text>
                    <Text style={styles.paragraph}>
                        7. Changes to Terms: We reserve the right to modify these terms at any time. Your continued use of the app constitutes acceptance.
                    </Text>
                </ScrollView>

                <View style={styles.footer}>
                    <Text style={styles.disclaimer}>
                        By continuing to use the Tirelo app, you acknowledge that you have read and agree to these Terms and Conditions.
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
