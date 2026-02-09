import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Linking, LayoutAnimation, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TireloFAQScreen() {
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How do I book an appointment?",
            a: "Go to the Explore tab, select a salon, choose your services and time, then confirm your booking."
        },
        {
            q: "Can I cancel my booking?",
            a: "Yes, you can cancel your booking from the 'My Bookings' section in your profile."
        },
        {
            q: "How do I win prizes in the Offers tab?",
            a: "You can spin the wheel in the Offers tab for a chance to win exclusive discounts."
        },
        {
            q: "What payment methods are supported?",
            a: "We support 'Pay at Salon' and secure online payments."
        },
        {
            q: "How do I contact support?",
            a: "You can reach us directly at 77593604."
        }
    ];

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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

                <Text style={styles.title}>Frequently Asked Questions</Text>

                <View style={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <View key={index} style={[styles.faqItem, expandedIndex === index && styles.faqItemExpanded]}>
                            <TouchableOpacity
                                style={styles.questionHeader}
                                onPress={() => toggleExpand(index)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.question, expandedIndex === index && styles.questionActive]}>{faq.q}</Text>
                                <Ionicons
                                    name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={expandedIndex === index ? "#FFB800" : "#666"}
                                />
                            </TouchableOpacity>
                            {expandedIndex === index && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answer}>{faq.a}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.supportCard}>
                    <Text style={styles.supportText}>Need more help? Contact us:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL('tel:77593604')}>
                        <Text style={styles.supportNumber}>77593604</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 15,
        paddingTop: 0,
    },
    backButton: {
        marginTop: 50,
        marginBottom: 10,
        marginLeft: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
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
        marginBottom: 25,
        textAlign: 'center',
    },
    faqList: {
        flex: 0, // No scroll
    },
    faqItem: {
        marginBottom: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        overflow: 'hidden',
    },
    faqItemExpanded: {
        backgroundColor: '#FFFFFF',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        flex: 1,
        paddingRight: 10,
    },
    questionActive: {
        color: '#FFB800',
    },
    answerContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    answer: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    supportCard: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginBottom: 20,
    },
    supportText: {
        fontSize: 13,
        color: '#666',
    },
    supportNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFB800',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
});
