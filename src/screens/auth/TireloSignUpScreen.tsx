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
import AuthUserIcon from '../../components/AuthUserIcon';
import AuthEmailIcon from '../../components/AuthEmailIcon';
import AuthPasswordIcon from '../../components/AuthPasswordIcon';
import AuthShowPasswordIcon from '../../components/AuthShowPasswordIcon';
import AuthHidePasswordIcon from '../../components/AuthHidePasswordIcon';

const { width } = Dimensions.get('window');

export default function TireloSignUpScreen() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await authService.signUp(email, password, fullName);

            if (error) {
                Alert.alert('Sign Up Failed', error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                Alert.alert(
                    'Success!',
                    'Account created successfully! Please check your email to verify your account before signing in.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('TireloSignIn' as never)
                        }
                    ]
                );
            }
        } catch (e: any) {
            Alert.alert('Error', e.message || 'An unexpected error occurred');
        } finally {
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

                        <Text style={styles.heading}>Sign Up</Text>

                        <View style={styles.form}>
                            {/* Full Name Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>FULL NAME</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.inputInner}
                                        placeholder="Enter your full name"
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        autoCapitalize="words"
                                    />
                                    <View style={styles.eyeIcon}>
                                        <AuthUserIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                                    </View>
                                </View>
                            </View>

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

                            {/* Phone Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <View style={styles.phoneInputWrapper}>
                                    <Text style={styles.phonePrefix}>+267</Text>
                                    <View style={styles.phoneDivider} />
                                    <TextInput
                                        style={styles.phoneInput}
                                        placeholder="71 234 567"
                                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                    <View style={styles.flagContainer}>
                                        <View style={styles.flagBlue} />
                                        <View style={styles.flagBlack} />
                                        <View style={styles.flagBlue} />
                                    </View>
                                </View>
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#004b2c" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                                )}
                            </TouchableOpacity>

                            {/* Sign In Link */}
                            <View style={styles.signInContainer}>
                                <Text style={styles.haveAccountText}>Have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('TireloSignIn' as never)}>
                                    <Text style={styles.signInLinkText}>Sign In</Text>
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
    signUpButton: {
        backgroundColor: '#EBEEF2',
        height: 55,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signUpButtonText: {
        color: '#004b2c',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    haveAccountText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    signInLinkText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    }
});

