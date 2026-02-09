import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Alert,
    Dimensions,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../utils/supabaseStorage';
import { supabase } from '../../config/supabase';
import LogoutIcon from '../../components/LogoutIcon';

const { width } = Dimensions.get('window');

export default function TireloProfileScreen() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || '');
                const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (data && !error) {
                    setFullName(data.full_name || '');
                    setAvatarUrl(data.avatar_url || null);
                    if (data.phone_number) {
                        setPhone(data.phone_number);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const pickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            try {
                setIsUploading(true);
                const publicUrl = await uploadImage('tirelo-assets', `profiles/avatar_${Date.now()}.jpg`, result.assets[0].uri);
                setAvatarUrl(publicUrl);

                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
                }
            } catch (err) {
                console.error(err);
                setAvatarUrl(result.assets[0].uri);
            } finally {
                setIsUploading(false);
            }
        }
    };


    const renderField = (label: string, value: string, secure = false) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputBox}>
                <Text style={styles.inputText}>{secure ? '••••••••••••••' : value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left', 'top']}>
            <StatusBar style="dark" />
            <View style={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/images/newimages/LogoIcon.png')}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>naledi.<Text style={styles.logoTextAi}>ai</Text></Text>
                    </View>
                    <TouchableOpacity style={styles.headerIcon}>
                        <MaterialCommunityIcons name="crop-free" size={28} color="#666" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.profileScroll}
                    contentContainerStyle={styles.profileSection}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.screenTitle}>Your Profile</Text>

                    {/* Avatar */}
                    <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar} disabled={isUploading}>
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{fullName ? fullName.charAt(0).toUpperCase() : 'T'}</Text>
                        )}
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={14} color="#FFF" />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.userName}>{fullName || 'Tlhalefang Ntshilane'}</Text>

                    {/* Fields */}
                    <View style={styles.form}>
                        {renderField('Email Address', email)}
                        {renderField('Phone Number', phone)}
                        {renderField('Password', '', true)}
                    </View>

                    {/* Logout Button */}
                    {/* Logout Button Row */}
                    <View style={styles.logoutRow}>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={async () => {
                                await supabase.auth.signOut();
                                // Reset navigation to Sign In screen
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'TireloSignIn' as never }],
                                });
                            }}
                        >
                            <LogoutIcon size={24} color="#FF6B6B" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: '#999', marginRight: 4 }}>Developed by</Text>
                            <Text style={{ fontSize: 12, color: '#004b2c', fontWeight: 'bold' }}>DevGen</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Custom Bottom Navigation Bar */}
                <View style={styles.bottomNavContainer}>
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => navigation.navigate('TireloAiChat' as never)}
                    >
                        <Image
                            source={require('../../../assets/images/newimages/Property 1=Logo Anime 1.png')}
                            style={styles.fabLogo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.navBar}>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('TireloHome' as never)}
                        >
                            <Image
                                source={require('../../../assets/images/newimages/nav_home.png')}
                                style={styles.navIconImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('TireloCrisisSupport' as never)}
                        >
                            <Image
                                source={require('../../../assets/images/newimages/nav_history.png')}
                                style={styles.navIconImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() => navigation.navigate('TireloAffirmations' as never)}
                        >
                            <Image
                                source={require('../../../assets/images/newimages/nav_exercises.png')}
                                style={styles.navIconImageSmall}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem}>
                            <Image
                                source={require('../../../assets/images/newimages/nav_profile.png')}
                                style={styles.navIconImageSmall}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 10, // Reduced height
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLogo: {
        width: 40,
        height: 40,
    },
    navIconImage: {
        width: 24,
        height: 24,
    },
    navIconImageSmall: {
        width: 22,
        height: 20,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    logoTextAi: {
        color: '#004b2c',
    },
    headerIcon: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileScroll: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 150, // Added padding to push logout button above nav
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 100, // Reduced size
        height: 100,
        borderRadius: 50,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 40,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    form: {
        width: '100%',
        gap: 20,
    },
    fieldContainer: {
        width: '100%',
    },
    fieldLabel: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left', // Move to left
        marginBottom: 8,
    },
    inputBox: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-start', // Move to left
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    inputText: {
        color: '#333',
        fontSize: 15,
        textAlign: 'left', // Move to left
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        paddingTop: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(224, 224, 224, 0.9)', // Match background
        flexDirection: 'row',
        alignItems: 'center',
    },
    fab: {
        width: 65, // Reduced size
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 10,
    },
    fabLogo: {
        width: 32, // Reduced logo size
        height: 32,
    },
    navBar: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        height: 55, // Reduced height
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginLeft: 15,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#004b2c',
    },
    navItem: {
        padding: 5,
    },
    logoutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20, // Reduced from 40 to move it up
        width: '100%',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    logoutText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFB800',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
});
