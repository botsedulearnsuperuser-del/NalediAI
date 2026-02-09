import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { chatService, authService } from '../../services/database';
import FeelingStuckIcon from '../../components/FeelingStuckIcon';

export default function TireloChatHistoryScreen() {
    const navigation = useNavigation();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadSessions();
            // Reset selection on focus? Maybe not needed.
        }, [])
    );

    const toggleSelection = (id: string) => {
        if (selectedSessions.includes(id)) {
            setSelectedSessions(selectedSessions.filter(s => s !== id));
        } else {
            setSelectedSessions([...selectedSessions, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedSessions.length === sessions.length) {
            setSelectedSessions([]);
        } else {
            setSelectedSessions(sessions.map(s => s.id));
        }
    };

    const handleDelete = () => {
        if (selectedSessions.length === 0) return;

        Alert.alert(
            "Delete Conversations",
            `Are you sure you want to delete ${selectedSessions.length} conversations?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await chatService.deleteSessions(selectedSessions);
                            await loadSessions();
                            setSelectionMode(false);
                            setSelectedSessions([]);
                        } catch (e) {
                            Alert.alert('Error', 'Failed to delete sessions');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const loadSessions = async () => {
        try {
            const { user } = await authService.getCurrentUser();
            if (user) {
                const { data } = await chatService.getSessions(user.id);
                setSessions(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#004b2c" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chat History</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.newChatBanner}>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>Feeling stuck?</Text>
                        <Text style={styles.bannerSubtext}>Start a fresh conversation and let's work through it together.</Text>
                        <TouchableOpacity
                            style={styles.newChatBtn}
                            onPress={() => navigation.navigate('TireloCognitiveReframing' as never)}
                        >
                            <Text style={styles.newChatBtnText}>Start New Chat</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require('../../../assets/images/newimages/Chat Icon.png')}
                        style={styles.bannerRobot}
                        resizeMode="contain"
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 10 }}>
                    <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Previous Conversations</Text>
                    {sessions.length > 0 && (
                        <TouchableOpacity onPress={() => {
                            setSelectionMode(!selectionMode);
                            setSelectedSessions([]);
                        }}>
                            <Text style={{ color: selectionMode ? '#FF6B6B' : '#666', fontWeight: 'bold' }}>
                                {selectionMode ? 'Cancel' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{ alignItems: 'center', marginBottom: 20, opacity: 0.8 }}>
                    <FeelingStuckIcon size={60} color="#004b2c" />
                </View>

                {selectionMode && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <TouchableOpacity onPress={handleSelectAll}>
                            <Text style={{ color: '#004b2c', fontWeight: 'bold' }}>Select All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} disabled={selectedSessions.length === 0}>
                            <Text style={{ color: selectedSessions.length > 0 ? '#FF6B6B' : '#CCC', fontWeight: 'bold' }}>
                                Delete ({selectedSessions.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="#004b2c" />
                ) : sessions.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>No chat history yet.</Text>
                ) : (
                    sessions.map((session) => (
                        <TouchableOpacity
                            key={session.id}
                            style={styles.sessionCard}
                            onPress={() => selectionMode ? toggleSelection(session.id) : navigation.navigate('TireloCognitiveReframing', { sessionId: session.id } as never)}
                        >
                            {selectionMode && (
                                <View style={{ marginRight: 10 }}>
                                    <Ionicons name={selectedSessions.includes(session.id) ? "checkbox" : "square-outline"} size={24} color="#004b2c" />
                                </View>
                            )}
                            <View style={styles.sessionIconBg}>
                                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
                            </View>
                            <View style={styles.sessionInfo}>
                                <Text style={styles.sessionTitleText} numberOfLines={1}>{session.title || 'New Conversation'}</Text>
                                <Text style={styles.sessionDate}>{formatDate(session.created_at)}</Text>
                            </View>
                            {!selectionMode && <Ionicons name="arrow-forward" size={20} color="#666" />}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 15,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#CDE1D8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    newChatBanner: {
        backgroundColor: '#004b2c',
        borderRadius: 25,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        minHeight: 160,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        color: '#A2C14D',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bannerSubtext: {
        color: '#FFFFFF',
        fontSize: 14,
        marginBottom: 15,
        lineHeight: 20,
    },
    newChatBtn: {
        backgroundColor: '#A2C14D',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    newChatBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bannerRobot: {
        width: 80,
        height: 100,
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 20,
    },
    sessionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sessionIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionInfo: {
        flex: 1,
        marginLeft: 15,
    },
    sessionTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sessionDate: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
    },
});
