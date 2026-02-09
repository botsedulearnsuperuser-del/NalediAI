import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function TireloChangePasswordScreen() {
    const navigation = useNavigation();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
                            Enhance your account security by updating your password.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {/* Old Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Old Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="•••••••••••••"
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    secureTextEntry={!showOld}
                                    placeholderTextColor="#A0A0A0"
                                />
                                <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                                    <Ionicons name={showOld ? "eye-outline" : "eye-off-outline"} size={20} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="•••••••••••••"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNew}
                                    placeholderTextColor="#A0A0A0"
                                />
                                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                    <Ionicons name={showNew ? "eye-outline" : "eye-off-outline"} size={20} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm New Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="•••••••••••••"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirm}
                                    placeholderTextColor="#A0A0A0"
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                    <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={20} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.updateButtonText}>Update Password</Text>
                        </TouchableOpacity>
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
    updateButton: {
        backgroundColor: '#FFB800',
        borderRadius: 25,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
