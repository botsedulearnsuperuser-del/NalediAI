import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import QuickExitIcon from '../../components/QuickExitIcon';
import PinLocationIcon from '../../components/PinLocationIcon';
import MedicalAssessmentIcon from '../../components/MedicalAssessmentIcon';
import EmergencyCallIcon from '../../components/EmergencyCallIcon';
import SecurityPoliceIcon from '../../components/SecurityPoliceIcon';
import FireRescueIcon from '../../components/FireRescueIcon';
import AmbulanceIcon from '../../components/AmbulanceIcon';
import PrivateSecurityIcon from '../../components/PrivateSecurityIcon';
import ReportAlertIcon from '../../components/ReportAlertIcon';
import EmergencyPhoneIcon from '../../components/EmergencyPhoneIcon';
import ModalCloseIcon from '../../components/ModalCloseIcon';

export default function TireloSaveMeScreen() {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');

    const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

    // Triage State
    const [triageStep, setTriageStep] = useState(0); // 0: Start, 1: Q1, 2: Q2, 3: Q3, 4: Done

    const handleQuickExit = () => {
        // Quickly navigate to a safe screen (Affirmations) and reset stack
        navigation.reset({
            index: 0,
            routes: [{ name: 'TireloAffirmations' as never }],
        });
    };

    const handleSendMessage = () => {
        if (!message) {
            Alert.alert('Empty Message', 'Please enter a message to send.');
            return;
        }
        // In a real app, send to backend here
        Alert.alert('Sent', 'Your anonymous message has been sent successfully.');
        setMessage('');
        setContact('');
    };

    const handlePinLocation = () => {
        Alert.alert('Location Pinned', 'Your current location has been securely pinned and added to your report.');
    };

    const handleCall = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    // Triage Flow
    const renderTriage = () => {
        if (triageStep === 0) {
            return (
                <View style={styles.triageCard}>
                    <Text style={styles.triageTitle}>Guided Triage</Text>
                    <Text style={styles.triageDesc}>Answer 3 simple questions to help us assess your safety.</Text>
                    <TouchableOpacity style={styles.triageButton} onPress={() => setTriageStep(1)}>
                        <Text style={styles.triageBtnText}>Start Assessment</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        const questions = [
            "Are you in immediate danger?",
            "Do you consent to auto sharing live location for the purpose of this emergency report?",
            "Do you have a safe place to go?"
        ];

        if (triageStep > 0 && triageStep <= 3) {
            return (
                <View style={styles.triageCard}>
                    <Text style={styles.questionNum}>Question {triageStep}/3</Text>
                    <Text style={styles.questionText}>{questions[triageStep - 1]}</Text>
                    <View style={styles.yesNoContainer}>
                        <TouchableOpacity style={styles.yesBtn} onPress={() => setTriageStep(triageStep + 1)}>
                            <Text style={styles.yesNoText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.noBtn} onPress={() => setTriageStep(triageStep + 1)}>
                            <Text style={styles.yesNoText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.triageCardRed}>
                <MedicalAssessmentIcon size={40} color="#FFF" />
                <Text style={styles.triageTitleLight}>Assessment Complete</Text>
                <Text style={styles.triageDescLight}>Based on your answers, we recommend contacting emergency services or a local shelter immediately.</Text>
                <TouchableOpacity style={styles.callHelpBtn} onPress={() => setEmergencyModalVisible(true)}>
                    <EmergencyCallIcon size={20} color="#FF6B6B" />
                    <Text style={styles.callHelpText}>Call Emergency Helpline</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Emergency Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={emergencyModalVisible}
                onRequestClose={() => setEmergencyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ReportAlertIcon size={40} color="#FF6B6B" />
                                <Text style={styles.modalTitle}>Report Submitted</Text>
                            </View>
                            <TouchableOpacity onPress={() => setEmergencyModalVisible(false)} style={{ padding: 5 }}>
                                <ModalCloseIcon size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                You have successfully submitted the report to the nearest emergency helpline. The response will be on the way soon.
                            </Text>
                            <Text style={styles.modalText}>
                                Please do not rely solely on Naledi. If possible, try to call the toll-free numbers below.
                            </Text>
                            <View style={styles.modalWarningBox}>
                                <Text style={styles.modalWarningText}>
                                    PLEASE STAY SAFE AND KEEP DISTANCE FROM YOUR PHONE IF ATTACKERS ARE STILL PRESENT OR AGGRAVATED.
                                </Text>
                            </View>

                            <Text style={styles.modalSubtitle}>Emergency Contacts</Text>

                            <View style={styles.contactGrid}>
                                <TouchableOpacity style={styles.contactCardGrid} onPress={() => handleCall('999')}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#E8F5E9' }]}>
                                        <SecurityPoliceIcon size={24} color="#004b2c" />
                                    </View>
                                    <Text style={styles.contactTitleGrid}>Botswana Police</Text>
                                    <Text style={styles.contactSubGrid}>999</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.contactCardGrid} onPress={() => handleCall('997')}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#FFF0F0' }]}>
                                        <AmbulanceIcon size={24} color="#FF6B6B" />
                                    </View>
                                    <Text style={styles.contactTitleGrid}>Ambulance</Text>
                                    <Text style={styles.contactSubGrid}>997</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.contactCardGrid} onPress={() => handleCall('998')}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#FFF3E0' }]}>
                                        <FireRescueIcon size={24} color="#F4A261" />
                                    </View>
                                    <Text style={styles.contactTitleGrid}>Fire & Rescue</Text>
                                    <Text style={styles.contactSubGrid}>998</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.contactCardGrid} onPress={() => handleCall('+2673930000')}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#F5F5F5' }]}>
                                        <PrivateSecurityIcon size={24} color="#333" />
                                    </View>
                                    <Text style={styles.contactTitleGrid}>Private Security</Text>
                                    <Text style={styles.contactSubGrid}>Fee-based</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Save Me</Text>
                <TouchableOpacity style={styles.discreetBtn} onPress={handleQuickExit}>
                    <QuickExitIcon size={20} color="#FFF" />
                    <Text style={styles.discreetText}>Quick Exit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Warning Banner */}
                <View style={styles.warningBanner}>
                    <Ionicons name="warning" size={24} color="#FFF" />
                    <Text style={styles.warningText}>
                        If you are in immediate danger, please call emergency services immediately.
                    </Text>
                </View>

                {/* Triage Section */}
                {renderTriage()}

                {/* Anonymous Reporting */}
                <Text style={styles.sectionHeader}>Anonymous Reporting</Text>
                <View style={styles.formCard}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Type your message securely..."
                        multiline
                        numberOfLines={4}
                        value={message}
                        onChangeText={setMessage}
                    />

                    <Text style={styles.label}>Contact (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone or Email (safe to contact)"
                        value={contact}
                        onChangeText={setContact}
                    />

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.pinLocationBtn} onPress={handlePinLocation}>
                            <PinLocationIcon size={20} color="#004b2c" />
                            <Text style={styles.pinText}>Pin Location</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                            <Text style={styles.sendText}>Send Report</Text>
                            <Ionicons name="send" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    discreetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    discreetText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },
    content: {
        padding: 20,
        paddingBottom: 50,
    },
    warningBanner: {
        backgroundColor: '#FF6B6B',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    warningText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
    },
    triageCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    triageCardRed: {
        backgroundColor: '#FF6B6B',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25, // Fixed missing brace
        alignItems: 'center',
    },
    triageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    triageTitleLight: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        marginTop: 10,
    },
    triageDesc: {
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
    },
    triageDescLight: {
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
        lineHeight: 20,
        textAlign: 'center',
    },
    triageButton: {
        backgroundColor: '#004b2c',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    triageBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    questionNum: {
        color: '#004b2c',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    yesNoContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    yesBtn: {
        flex: 1,
        backgroundColor: '#FF6B6B',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    noBtn: {
        flex: 1,
        backgroundColor: '#004b2c',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    yesNoText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    callHelpBtn: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    callHelpText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },
    label: {
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    textArea: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 15,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    pinLocationBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F5E9',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#004b2c',
    },
    pinText: {
        color: '#004b2c',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    sendBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004b2c',
        paddingVertical: 12,
        borderRadius: 12,
    },
    sendText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginRight: 8,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '85%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    modalBody: {
        flex: 1,
    },
    modalText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 22,
        marginBottom: 15,
    },
    modalWarningBox: {
        backgroundColor: '#FFF0F0',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        marginBottom: 20,
    },
    modalWarningText: {
        color: '#D32F2F',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 5,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F9F7',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    contactIconBg: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        elevation: 2,
    },
    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    contactSub: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    contactCardGrid: {
        width: '48%',
        backgroundColor: '#F5F9F7',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    contactTitleGrid: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textAlign: 'center',
    },
    contactSubGrid: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
    },
    closeModalBtn: {
        backgroundColor: '#333',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    closeModalText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
