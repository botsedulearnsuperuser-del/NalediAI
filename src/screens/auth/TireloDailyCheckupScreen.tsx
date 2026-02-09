import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { checkupService, authService } from '../../services/database';

const { width } = Dimensions.get('window');

const MOODS = [
    { label: 'Happy', icon: 'emoticon-happy', color: '#FFD700' },
    { label: 'Calm', icon: 'emoticon-neutral', color: '#87CEEB' },
    { label: 'Sad', icon: 'emoticon-sad', color: '#6495ED' },
    { label: 'Angry', icon: 'emoticon-angry', color: '#FF6347' },
    { label: 'Anxious', icon: 'emoticon-confused', color: '#9370DB' },
    { label: 'Excited', icon: 'emoticon-excited', color: '#FF8C00' },
];

const EMOTIONS = [
    'Peaceful', 'Grateful', 'Lonely', 'Stressed', 'Focused', 'Bored',
    'Inspired', 'Ambitious', 'Tired', 'Optimistic', 'Anxious', 'Confident',
    'Creative', 'Restless', 'Empowered'
];

export default function TireloDailyCheckupScreen() {
    const navigation = useNavigation();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

    const toggleEmotion = (emotion: string) => {
        if (selectedEmotions.includes(emotion)) {
            setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
        } else {
            setSelectedEmotions([...selectedEmotions, emotion]);
        }
    };

    const handleSaveCheckup = async () => {
        if (!selectedMood) {
            Alert.alert('Missing Information', 'Please select your mood before saving.');
            return;
        }

        try {
            const { user } = await authService.getCurrentUser();
            if (user) {
                await checkupService.saveCheckup(user.id, selectedMood, selectedEmotions);
                Alert.alert('Success', 'Your daily check-up has been saved!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error('Error saving checkup:', error);
            Alert.alert('Error', 'Failed to save your check-up. Please try again.');
        }
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
                <Text style={styles.headerTitle}>Daily Check Up</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>How are you feeling today?</Text>

                <View style={styles.moodGrid}>
                    {MOODS.map((mood) => (
                        <TouchableOpacity
                            key={mood.label}
                            style={[
                                styles.moodCard,
                                selectedMood === mood.label && { backgroundColor: mood.color, borderColor: mood.color }
                            ]}
                            onPress={() => setSelectedMood(mood.label)}
                        >
                            <MaterialCommunityIcons
                                name={mood.icon as any}
                                size={40}
                                color={selectedMood === mood.label ? '#FFFFFF' : '#666'}
                            />
                            <Text style={[styles.moodLabel, selectedMood === mood.label && { color: '#FFFFFF', fontWeight: 'bold' }]}>
                                {mood.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>What's describing your mood?</Text>
                    <View style={styles.scrollHintContainer}>
                        <Text style={styles.scrollHintText}>Swipe left</Text>
                        <Ionicons name="arrow-back" size={14} color="#666" />
                    </View>
                </View>

                {/* 3 Rows of Horizontal Scrollable Emotions */}
                <View style={styles.horizontalEmotionsContainer}>
                    {[
                        EMOTIONS.slice(0, 5),
                        EMOTIONS.slice(5, 10),
                        EMOTIONS.slice(10, 15)
                    ].map((row, rowIndex) => (
                        <ScrollView
                            key={rowIndex}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.emotionRow}
                        >
                            {row.map((emotion) => (
                                <TouchableOpacity
                                    key={emotion}
                                    style={[
                                        styles.emotionTag,
                                        selectedEmotions.includes(emotion) && styles.selectedTag
                                    ]}
                                    onPress={() => toggleEmotion(emotion)}
                                >
                                    <Text style={[
                                        styles.emotionTagText,
                                        selectedEmotions.includes(emotion) && styles.selectedTagText
                                    ]}>
                                        {emotion}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveCheckup}
                >
                    <Text style={styles.saveButtonText}>Save Check Up</Text>
                </TouchableOpacity>
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
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004b2c',
        marginTop: 20,
        marginBottom: 30,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    moodCard: {
        backgroundColor: '#FFFFFF',
        width: (width - 60) / 3,
        aspectRatio: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    moodLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
    scrollHintText: {
        fontSize: 12,
        color: '#666',
        marginRight: 4,
    },
    horizontalEmotionsContainer: {
        marginBottom: 40,
        gap: 15,
    },
    emotionRow: {
        paddingRight: 20,
    },
    emotionTag: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 10,
    },
    selectedTag: {
        backgroundColor: '#004b2c',
        borderColor: '#004b2c',
    },
    emotionTagText: {
        color: '#666',
        fontSize: 14,
    },
    selectedTagText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#004b2c',
        width: '100%',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
