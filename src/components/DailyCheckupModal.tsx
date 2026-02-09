import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    ActivityIndicator,
    Alert,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkupService, authService } from '../services/database';
import { geminiService } from '../services/gemini';
import PopupCloseIcon from './PopupCloseIcon';

const { width } = Dimensions.get('window');

interface DailyCheckupModalProps {
    visible: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function DailyCheckupModal({ visible, onClose, onComplete }: DailyCheckupModalProps) {
    const [step, setStep] = useState(0); // 0: Mood, 1: Note, 2: Result
    const [mood, setMood] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [aiTip, setAiTip] = useState('');
    const [generatingTip, setGeneratingTip] = useState(false);

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
    };

    const handleStep0Next = () => {
        if (!mood) {
            Alert.alert("Selection Required", "Please select how you are feeling today.");
            return;
        }
        setStep(1);
    };

    const handleStep1Next = async () => {
        if (!note.trim()) {
            Alert.alert("Input Required", "Please tell us what made you feel that way.");
            return;
        }
        Keyboard.dismiss();
        await handleNoteSubmit();
    };

    const handleNoteSubmit = async () => {
        setSaving(true);
        setGeneratingTip(true);
        // Move to step 2 immediately to show loading there, or wait? 
        // Let's go to step 2 and show loading spinner inside the tip box.
        setStep(2);

        try {
            const { user } = await authService.getCurrentUser();
            let currentUserId = user?.id;

            if (currentUserId && mood) {
                // Determine normalized mood string for DB
                let dbMood = mood.toLowerCase();
                if (dbMood === 'neutral mood') dbMood = 'neutral';

                // Save to Checkup Service
                await checkupService.saveCheckup(currentUserId, dbMood, [note]);
            }

            // Generate AI Tip
            const prompt = `The user is reporting their daily mood as "${mood}" and the reason is: "${note}". 
            Provide a short, compassionate, and specific daily mental health tip or thought for them based on this context. 
            Keep it under 50 words.`;

            const tip = await geminiService.chat(prompt);
            setAiTip(tip);

        } catch (error) {
            console.error(error);
            setAiTip("Remember to take things one day at a time. We are here for you.");
        } finally {
            setSaving(false);
            setGeneratingTip(false);
        }
    };

    const handleFinish = () => {
        setStep(0);
        setMood(null);
        setNote('');
        setAiTip('');
        onComplete();
    };

    const renderStep0 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title}>How do you feel today?</Text>

            <View style={styles.moodContainer}>
                <TouchableOpacity
                    style={[styles.moodButton, mood === 'Neutral' && styles.moodButtonSelected]}
                    onPress={() => handleMoodSelect('Neutral')}
                >
                    <Ionicons name="happy-outline" size={24} color={mood === 'Neutral' ? '#FFFFFF' : '#004b2c'} style={styles.moodIcon} />
                    <Text style={[styles.moodText, mood === 'Neutral' && styles.moodTextSelected]}>Neutral Mood</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.moodButton, mood === 'Happy' && styles.moodButtonSelected]}
                    onPress={() => handleMoodSelect('Happy')}
                >
                    <Ionicons name="happy" size={24} color={mood === 'Happy' ? '#FFFFFF' : '#004b2c'} style={styles.moodIcon} />
                    <Text style={[styles.moodText, mood === 'Happy' && styles.moodTextSelected]}>Happy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.moodButton, mood === 'Sad' && styles.moodButtonSelected]}
                    onPress={() => handleMoodSelect('Sad')}
                >
                    <Ionicons name="sad" size={24} color={mood === 'Sad' ? '#FFFFFF' : '#004b2c'} style={styles.moodIcon} />
                    <Text style={[styles.moodText, mood === 'Sad' && styles.moodTextSelected]}>Sad</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleStep0Next}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title}>What has made you feel{'\n'}like that?</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Type here..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={note}
                    onChangeText={setNote}
                />
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleStep1Next}>
                {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.nextButtonText}>Next</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.title}>Daily Check Up Completed!</Text>
            <Text style={styles.subtitle}>Here's my tip for the day</Text>

            <View style={styles.tipBox}>
                {generatingTip ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                    <Text style={styles.tipText}>
                        "{aiTip}"
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[styles.finishButton, generatingTip && { opacity: 0.5 }]}
                onPress={handleFinish}
                disabled={generatingTip}
            >
                <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    {/* Background Circles (Clipped to Card) */}
                    <View style={styles.bgCircle1} />
                    <View style={styles.bgCircle2} />

                    {/* Close Button - Top Right */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <PopupCloseIcon size={32} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Header Title */}
                    <Text style={styles.headerTitle}>Daily Checkup</Text>

                    {/* Mascot */}
                    <Image
                        source={require('../../assets/images/newimages/Chat Icon.png')}
                        style={styles.mascot}
                        resizeMode="contain"
                    />

                    {/* Content Steps */}
                    <View style={styles.contentContainer}>
                        {step === 0 && renderStep0()}
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end', // Moved Down
        alignItems: 'center',
        padding: 0,
        paddingBottom: 30, // Bottom spacing
    },
    modalCard: {
        width: '98%',
        maxWidth: 600,
        backgroundColor: '#004b2c',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 20,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    bgCircle1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        top: -150,
        alignSelf: 'center',
    },
    bgCircle2: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        top: -110,
        alignSelf: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        zIndex: 10,
    },
    mascot: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    contentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    stepContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
    },
    moodContainer: {
        width: '100%',
        gap: 10,
        marginBottom: 25,
    },
    moodButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    moodButtonSelected: {
        backgroundColor: '#206b4d', // Darker green or accent for selection
        borderWidth: 1,
        borderColor: '#FFFFFF'
    },
    moodText: {
        color: '#004b2c',
        fontSize: 16,
        fontWeight: 'bold',
    },
    moodTextSelected: {
        color: '#FFFFFF',
    },
    moodIcon: {
        marginRight: 0,
    },
    inputContainer: {
        width: '100%',
        height: 120,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 25,
    },
    textInput: {
        color: '#FFFFFF',
        fontSize: 14,
        flex: 1,
        textAlignVertical: 'top',
    },
    tipBox: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 25,
        width: '100%',
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tipText: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    nextButton: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    finishButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        alignItems: 'center',
    },
    finishButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
