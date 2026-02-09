import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TireloConfirmationScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.navigate('TireloHome' as never)}
                >
                    <Ionicons name="close" size={24} color="#1A1A1A" />
                </TouchableOpacity>

                <View style={styles.mainContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={100} color="#FFB800" />
                    </View>

                    <Text style={styles.title}>Appointment Confirmed!</Text>
                    <Text style={styles.subtitle}>
                        Thank you for booking with us. Just arrive at your scheduled time and our experts will be ready to give you a refreshing experience.
                    </Text>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => navigation.navigate('TireloHome' as never)}
                    >
                        <Text style={styles.homeButtonText}>Back To Home</Text>
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
        paddingHorizontal: 25,
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    closeButton: {
        width: 40,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
    },
    iconContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    homeButton: {
        backgroundColor: '#FFB800',
        borderRadius: 10,
        height: 55,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFB800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
