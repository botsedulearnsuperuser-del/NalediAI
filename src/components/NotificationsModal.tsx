import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PopupCloseIcon from './PopupCloseIcon';
import ModalNotificationIcon from './ModalNotificationIcon';

const { width } = Dimensions.get('window');

interface Notification {
    id: string;
    title: string;
    message: string;
    type?: string;
    read?: boolean;
}

interface NotificationsModalProps {
    visible: boolean;
    onClose: () => void;
    notifications?: Notification[];
}

export default function NotificationsModal({ visible, onClose, notifications = [] }: NotificationsModalProps) {

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.mascotCircleLarge}>
                <Image
                    source={require('../../assets/images/newimages/Chat Icon.png')}
                    style={styles.mascotLarge}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.emptyText}>
                You currently dont have any in-app{'\n'}notifications
            </Text>
        </View>
    );

    const renderListState = () => (
        <ScrollView style={styles.listContainer} contentContainerStyle={{ paddingBottom: 40 }}>
            {notifications.map((notif) => (
                <View key={notif.id} style={styles.notificationItem}>
                    <View style={styles.mascotCircleSmall}>
                        <Image
                            source={require('../../assets/images/newimages/Chat Icon.png')}
                            style={styles.mascotSmall}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.notifTextContainer}>
                        <Text style={styles.notifTitle}>{notif.title}</Text>
                        <Text style={styles.notifMessage}>{notif.message}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
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
                        <PopupCloseIcon size={32} color="#004b2c" />
                    </TouchableOpacity>

                    {/* Header Title with Icon */}
                    <View style={styles.headerContainer}>
                        <ModalNotificationIcon size={24} color="#004b2c" />
                        <Text style={styles.headerTitle}>Notifications</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.contentBody}>
                        {notifications.length === 0 ? renderEmptyState() : renderListState()}
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 0,
        paddingBottom: 30,
    },
    modalCard: {
        width: '98%', // Maximized width
        maxWidth: 600,
        backgroundColor: '#E0E0E0', // Light background
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
        borderColor: 'rgba(0, 75, 44, 0.05)',
        top: -150,
        alignSelf: 'center',
    },
    bgCircle2: {
        position: 'absolute',
        width: 320,
        height: 320,
        borderRadius: 160,
        borderWidth: 1,
        borderColor: 'rgba(0, 75, 44, 0.05)',
        top: -110,
        alignSelf: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        zIndex: 10,
        gap: 8,
    },
    headerTitle: {
        color: '#004b2c',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentBody: {
        width: '100%',
        alignItems: 'center',
        minHeight: 200, // Ensure some height even if empty
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    mascotCircleLarge: {
        width: 120, // Reduced from 150
        height: 120,
        borderRadius: 60,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    mascotLarge: {
        width: 80,
        height: 80,
        marginTop: 8,
    },
    emptyText: {
        color: '#004b2c',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 22,
    },
    listContainer: {
        width: '100%',
    },
    notificationItem: {
        backgroundColor: 'rgba(0, 75, 44, 0.2)', // Light green tint based on image (looks grayish green)
        // Image shows item background: #CCD6D0?
        // Let's try explicit color similar to image
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mascotCircleSmall: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#004b2c',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    mascotSmall: {
        width: 35,
        height: 35,
        marginTop: 5,
    },
    notifTextContainer: {
        flex: 1,
    },
    notifTitle: {
        color: '#004b2c',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    notifMessage: {
        color: '#333',
        fontSize: 14,
    },
});
