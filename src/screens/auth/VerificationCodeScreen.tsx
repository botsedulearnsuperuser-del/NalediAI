import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function VerificationCodeScreen() {
    const navigation = useNavigation();
    const [code, setCode] = useState(['', '', '', '']);

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        // Logic to focus next input would go here
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                        <Ionicons name="key-outline" size={30} color="#FFF" />
                    </View>
                </View>

                <Text style={styles.title}>Enter a Code</Text>
                <Text style={styles.subtitle}>
                    We sent a verification code to {"\n"} your phone number <Text style={styles.phoneText}>(+22) 123 546...</Text>
                </Text>

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.codeInput}
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                            placeholder={index === 0 ? "4" : index === 1 ? "5" : index === 2 ? "0" : "5"} // Placeholder from design
                            placeholderTextColor="#000"
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ChangePassword' as never)}
                >
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF6FF',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    iconBackground: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#8AB4F8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
    },
    phoneText: {
        color: '#3B82F6',
        fontWeight: '600'
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    codeInput: {
        width: 60,
        height: 60,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#CCC', // Light gray border
        fontSize: 24,
        color: '#000',
        backgroundColor: 'transparent',
    },
    button: {
        backgroundColor: '#3B82F6',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendText: {
        color: '#3B82F6',
        textDecorationLine: 'underline',
        fontSize: 14,
    }
});
