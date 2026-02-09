import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function TireloAccountSuccessScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>

                {/* Robot Illustration Placeholder */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.circle}>
                        <MaterialCommunityIcons name="robot" size={120} color="#004b2c" />
                    </View>
                </View>

                <Text style={styles.title}>Your Account has been{"\n"}successfully created</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('TireloSignIn' as never)}
                >
                    <Text style={styles.buttonText}>Go To Sign In</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#004b2c',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    illustrationContainer: {
        marginBottom: 50,
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#EBEEF2', // Match the button color/off-white
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 60,
        lineHeight: 34,
    },
    button: {
        backgroundColor: '#EBEEF2',
        width: '100%',
        height: 55,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#004b2c',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
