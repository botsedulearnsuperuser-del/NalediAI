import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../../services/database';
import AuthEmailIcon from '../../components/AuthEmailIcon';
import AuthPasswordIcon from '../../components/AuthPasswordIcon';
import AuthShowPasswordIcon from '../../components/AuthShowPasswordIcon';
import AuthHidePasswordIcon from '../../components/AuthHidePasswordIcon';

const { width } = Dimensions.get('window');

export default function TireloSignInScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResendEmail = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address first.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await authService.resendVerification(email);
            if (error) {
                Alert.alert('Error', error.message || 'Failed to resend email.');
            } else {
                Alert.alert('Success', 'Verification email sent! Please check your inbox (and spam folder).');
            }
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await authService.signIn(email, password);

            // If there's an error, show it and stop
            if (error) {
                if (error.message.includes('verify your email')) {
                    Alert.alert(
                        'Email Not Verified',
                        'You need to verify your email first. Did you not receive the email?',
                        [
                            { text: 'OK', style: 'cancel' },
                            { text: 'Resend Email', onPress: () => handleResendEmail() }
                        ]
                    );
                } else {
                    Alert.alert('Sign In Failed', error.message);
                }
                setLoading(false);
                return;
            }

            // If no data or no session, user cannot sign in
            if (!data || !data.session) {
                Alert.alert(
                    'Sign In Failed',
                    'Unable to sign in. Please verify your email.',
                    [
                        { text: 'OK' },
                        { text: 'Resend Email', onPress: () => handleResendEmail() }
                    ]
                );
                setLoading(false);
                return;
            }

            // If no user in the response, something is wrong
            if (!data.user) {
                Alert.alert('Sign In Failed', 'No user found. Please sign up first.');
                setLoading(false);
                return;
            }

            // All checks passed - navigate to home
            navigation.navigate('TireloLoading', { target: 'TireloHome' } as any);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>

                        {/* Logo Section */}
                        <View style={styles.logoContainer}>
                            <View style={styles.logoRow}>
                                <Image
                                    source={require('../../../assets/images/newimages/Property 1=Logo Anime 1.png')}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.logoText}>naledi.</Text>
                            </View>
                        </View>

                        <Text style={styles.heading}>Sign In</Text>

                        <View style={styles.form}>
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>EMAIL OR USERNAME</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.inputInner}
                                        placeholder="Enter your email here"
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                    <View style={styles.eyeIcon}>
                                        <AuthEmailIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                                    </View>
                                </View>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.inputInner}
                                        placeholder="Enter your Password here"
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <View style={{ marginRight: 8 }}>
                                        <AuthPasswordIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                                    </View>
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                        {showPassword ? (
                                            <AuthHidePasswordIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                                        ) : (
                                            <AuthShowPasswordIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>



                            {/* Login Button */}
                            <TouchableOpacity style={styles.loginButton} onPress={handleSignIn} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#004b2c" />
                                ) : (
                                    <Text style={styles.loginButtonText}>Login</Text>
                                )}
                            </TouchableOpacity>

                            {/* Sign Up Link */}
                            <View style={styles.signUpContainer}>
                                <Text style={styles.noAccountText}>No account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('TireloSignUp' as never)}>
                                    <Text style={styles.signUpLinkText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: '#004b2c',
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 30,
        alignItems: 'center',
        paddingVertical: 40,
    },
    logoContainer: {
        marginBottom: 50,
        marginTop: 20,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 60,
        height: 60,
    },
    logoText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 10,
    },
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 30,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 4,
        paddingHorizontal: 15,
        color: '#FFFFFF',
        fontSize: 16,
    },
    inputWrapper: {
        height: 55,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    inputInner: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 5,
    },
    phoneInputWrapper: {
        height: 55,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    phonePrefix: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    phoneDivider: {
        width: 1,
        height: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 10,
    },
    phoneInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        height: '100%',
    },
    flagContainer: {
        width: 24,
        height: 16,
        justifyContent: 'center',
    },
    flagBlue: {
        flex: 1,
        backgroundColor: '#6DA9D2',
    },
    flagBlack: {
        height: 4,
        backgroundColor: '#000000',
        borderColor: '#FFFFFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    loginButton: {
        backgroundColor: '#EBEEF2',
        height: 55,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#004b2c',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    noAccountText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    signUpLinkText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    }
});

