import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView,
    Image,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { affirmationsService, authService } from '../../services/database';

const { width } = Dimensions.get('window');

const DEFAULT_AFFIRMATIONS = [
    "I am great at my craft",
    "I am capable of achieving my goals",
    "I am worthy of love and happiness",
    "I am resilient and strong",
    "I am at peace with my past"
];

export default function TireloAffirmationsScreen() {
    const navigation = useNavigation();
    const [affirmations, setAffirmations] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [isSetupMode, setIsSetupMode] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingAffirmations, setEditingAffirmations] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAffirmations();
    }, []);

    // Auto-play affirmation when index changes or loaded
    useEffect(() => {
        if (!loading && !isSetupMode && affirmations.length > 0) {
            handleSpeak();
        }
    }, [index, loading, isSetupMode, affirmations]);

    const loadAffirmations = async () => {
        try {
            const { user } = await authService.getCurrentUser();
            if (user) {
                setUserId(user.id);
                const { data, error } = await affirmationsService.getAffirmations(user.id);

                if (data && data.length > 0) {
                    const affirmationTexts = data.map(a => a.affirmation_text);
                    setAffirmations(affirmationTexts);
                    setIsSetupMode(false);
                } else {
                    // No affirmations yet, show setup with defaults
                    setEditingAffirmations(DEFAULT_AFFIRMATIONS);
                    setIsSetupMode(true);
                }
            }
        } catch (error) {
            console.error('Error loading affirmations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetupComplete = async () => {
        const validAffirmations = editingAffirmations.filter(a => a.trim());
        if (validAffirmations.length === 0) {
            Alert.alert('Error', 'Please add at least one affirmation');
            return;
        }

        setLoading(true);
        try {
            const { error } = await affirmationsService.saveAffirmations(userId, validAffirmations);
            if (error) {
                Alert.alert('Error', 'Failed to save affirmations');
            } else {
                setAffirmations(validAffirmations);
                setIsSetupMode(false);
                setIndex(0);
                Alert.alert('Success', 'Your affirmations have been saved!');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = () => {
        setEditingAffirmations([...affirmations]);
        setIsEditMode(true);
    };

    const handleSaveEdit = async () => {
        const validAffirmations = editingAffirmations.filter(a => a.trim());
        if (validAffirmations.length === 0) {
            Alert.alert('Error', 'Please add at least one affirmation');
            return;
        }

        setLoading(true);
        try {
            const { error } = await affirmationsService.saveAffirmations(userId, validAffirmations);
            if (error) {
                Alert.alert('Error', 'Failed to save affirmations');
            } else {
                setAffirmations(validAffirmations);
                setIsEditMode(false);
                setIndex(0);
                Alert.alert('Success', 'Your affirmations have been updated!');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingAffirmations([]);
        setIsEditMode(false);
    };

    const updateAffirmation = (idx: number, text: string) => {
        const updated = [...editingAffirmations];
        updated[idx] = text;
        setEditingAffirmations(updated);
    };

    const addAffirmation = () => {
        if (editingAffirmations.length < 10) {
            setEditingAffirmations([...editingAffirmations, '']);
        }
    };

    const removeAffirmation = (idx: number) => {
        setEditingAffirmations(editingAffirmations.filter((_, i) => i !== idx));
    };

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % affirmations.length);
    };

    const handleSpeak = () => {
        Speech.speak(affirmations[index], {
            language: 'en-US',
            rate: 0.9,
            pitch: 1.0,
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#004b2c" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading your affirmations...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Setup Screen
    if (isSetupMode) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#004b2c" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Set Your Affirmations</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.setupContent}>
                    <Text style={styles.setupTitle}>Create Your Daily Affirmations</Text>
                    <Text style={styles.setupSubtitle}>
                        Write powerful statements that resonate with your goals and values. These will be your daily reminders of greatness.
                    </Text>

                    {editingAffirmations.map((affirmation, idx) => (
                        <View key={idx} style={styles.inputRow}>
                            <TextInput
                                style={styles.affirmationInput}
                                placeholder={`Affirmation ${idx + 1}`}
                                placeholderTextColor="#999"
                                value={affirmation}
                                onChangeText={(text) => updateAffirmation(idx, text)}
                                multiline
                            />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeAffirmation(idx)}
                            >
                                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {editingAffirmations.length < 10 && (
                        <TouchableOpacity style={styles.addButton} onPress={addAffirmation}>
                            <Ionicons name="add-circle" size={24} color="#004b2c" />
                            <Text style={styles.addButtonText}>Add Another Affirmation</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.saveButton, editingAffirmations.filter(a => a.trim()).length === 0 && styles.saveButtonDisabled]}
                        onPress={handleSetupComplete}
                        disabled={editingAffirmations.filter(a => a.trim()).length === 0}
                    >
                        <Text style={styles.saveButtonText}>Start My Journey</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Main Affirmations Screen
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#004b2c" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Affirmations</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleStartEdit}
                >
                    <Ionicons name="create-outline" size={24} color="#004b2c" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Background circles effect */}
                <View style={styles.circlesContainer}>
                    <View style={[styles.circle, { width: width * 1.2, height: width * 1.2, opacity: 0.1 }]} />
                    <View style={[styles.circle, { width: width * 1.0, height: width * 1.0, opacity: 0.2 }]} />
                    <View style={[styles.circle, { width: width * 0.8, height: width * 0.8, opacity: 0.3 }]} />

                    <Image
                        source={require('../../../assets/images/newimages/Chat Icon.png')}
                        style={styles.robotImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.affirmationLabel}>Affirmation {index + 1}</Text>

                    <View style={styles.affirmationBox}>
                        <Text style={styles.affirmationText}>{affirmations[index]}</Text>
                        <TouchableOpacity style={styles.volumeButton} onPress={handleSpeak}>
                            <MaterialCommunityIcons name="volume-high" size={32} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={isEditMode}
                animationType="slide"
                transparent={false}
            >
                <SafeAreaView style={styles.container}>
                    <StatusBar style="dark" />
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleCancelEdit}
                        >
                            <Ionicons name="close" size={24} color="#004b2c" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Edit Affirmations</Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={handleSaveEdit}
                        >
                            <Ionicons name="checkmark" size={28} color="#004b2c" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.setupContent}>
                        {editingAffirmations.map((affirmation, idx) => (
                            <View key={idx} style={styles.inputRow}>
                                <TextInput
                                    style={styles.affirmationInput}
                                    placeholder={`Affirmation ${idx + 1}`}
                                    placeholderTextColor="#999"
                                    value={affirmation}
                                    onChangeText={(text) => updateAffirmation(idx, text)}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeAffirmation(idx)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {editingAffirmations.length < 10 && (
                            <TouchableOpacity style={styles.addButton} onPress={addAffirmation}>
                                <Ionicons name="add-circle" size={24} color="#004b2c" />
                                <Text style={styles.addButtonText}>Add Another Affirmation</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBEEF2',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 45 : 15,
        paddingBottom: 15,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#D6E4E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#5C677D',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    circlesContainer: {
        height: 350,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 1.2,
        borderColor: '#004b2c',
    },
    robotImage: {
        width: 250,
        height: 250,
    },
    content: {
        width: '100%',
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: -10,
    },
    affirmationLabel: {
        fontSize: 22,
        fontWeight: '900',
        color: '#5C677D',
        marginBottom: 20,
        textAlign: 'center',
    },
    affirmationBox: {
        backgroundColor: '#004b2c',
        width: '100%',
        borderRadius: 15,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    affirmationText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 20,
    },
    volumeButton: {
        marginTop: 5,
    },
    nextButton: {
        backgroundColor: '#004b2c',
        width: '100%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
    editButton: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setupContent: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    setupTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#004b2c',
        marginBottom: 15,
        marginTop: 20,
    },
    setupSubtitle: {
        fontSize: 16,
        color: '#5C677D',
        lineHeight: 24,
        marginBottom: 30,
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    affirmationInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 18,
        fontSize: 16,
        color: '#333',
        borderWidth: 1.5,
        borderColor: '#E0EAE5',
        minHeight: 65,
        fontWeight: '500',
    },
    removeButton: {
        marginLeft: 12,
        padding: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        backgroundColor: 'rgba(0, 75, 44, 0.08)',
        borderRadius: 15,
        marginTop: 10,
        marginBottom: 25,
    },
    addButtonText: {
        fontSize: 16,
        color: '#004b2c',
        fontWeight: '900',
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#004b2c',
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonDisabled: {
        backgroundColor: '#B0B8BB',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },
});
