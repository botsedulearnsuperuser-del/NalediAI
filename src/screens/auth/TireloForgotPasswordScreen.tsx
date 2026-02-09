import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../config/supabase';
import { Alert } from 'react-native';

export default function TireloForgotPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.logoText}>TIRELO</Text>
                        <Text style={styles.tagline}>BEAUTY <Text style={styles.dot}>•</Text> STYLE <Text style={styles.dot}>•</Text> LUXURY</Text>
                        <Text style={styles.description}>
                            Reset your password to continue your luxury experience.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#A0A0A0"
                            />
                        </View>

                        <TouchableOpacity style={styles.resetButton} onPress={async () => {
                            if (!email) {
                                Alert.alert('Error', 'Please enter your email address');
                                return;
                            }
                            setLoading(true);
                            setMessage('');

                            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                redirectTo: 'https://example.com/update-password', // Update this with your deep link
                            });

                            setLoading(false);

                            if (error) {
                                Alert.alert('Error', error.message);
                            } else {
                                setMessage('Check your email for the password reset link.');
                                Alert.alert('Success', 'Check your email for the password reset link.');
                            }
                        }} disabled={loading}>
                            <Text style={styles.resetButtonText}>{loading ? 'Sending...' : 'Reset Password'}</Text>
                        </TouchableOpacity>

                        {message ? <Text style={{ color: 'green', textAlign: 'center', marginTop: 10 }}>{message}</Text> : null}

                        <View style={styles.footerLinkContainer}>
                            <Text style={styles.rememberPasswordText}>Remember your password? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('TireloSignIn' as never)}>
                                <Text style={styles.signInText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    backButton: {
        marginBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
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
        fontSize: 10,
        letterSpacing: 2,
        color: '#DAB24E',
        marginTop: 5,
        fontWeight: '700',
    },
    dot: {
        fontSize: 14,
    },
    description: {
        fontSize: 14,
        color: '#1A1A1A',
        textAlign: 'center',
        marginTop: 15,
        lineHeight: 20,
        paddingHorizontal: 15,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1A1A1A',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    passwordInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
    },
    resetButton: {
        backgroundColor: '#FFB800',
        borderRadius: 25,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    rememberPasswordText: {
        fontSize: 13,
        color: '#1A1A1A',
    },
    signInText: {
        fontSize: 13,
        color: '#FFB800',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
