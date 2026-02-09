import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Share, Modal, ActivityIndicator, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import { transactionService } from '../../services/transactionService';

const { width, height } = Dimensions.get('window');

export default function RequestFareScreen() {
  const navigation = useNavigation();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [userPaymentCode, setUserPaymentCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentCode = async () => {
      try {
        const { profile, error } = await transactionService.getUserProfile();
        if (profile && !error) {
          setUserPaymentCode(profile.payment_code || '');
        }
      } catch (error) {
        console.error('Error fetching payment code:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentCode();
  }, []);
  
  const handleShare = async () => {
    try {
      // Format message with code bolded and italicized for WhatsApp
      // Using *_text_* for bold + italic in WhatsApp
      const shareMessage = `Send me transport fare via TSAMAYA!\n\nUse my payment code:\n\n*_${userPaymentCode}_*\n\nDownload TSAMAYA app to send transport fare instantly!`;
      
      await Share.share({
        message: shareMessage,
        title: 'Request Fare - TSAMAYA',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(userPaymentCode);
      Alert.alert('Copied!', 'Payment code copied to clipboard');
    } catch (error) {
      console.error('Error copying:', error);
      Alert.alert('Error', 'Failed to copy code');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Fare</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <Icon name="help-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Your Payment QR Code</Text>
        <Text style={styles.subtitle}>
          Share this QR code with others to receive transport fare payments
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ACB2" />
            <Text style={styles.loadingText}>Loading your QR code...</Text>
          </View>
        ) : userPaymentCode ? (
          <>
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={userPaymentCode}
                  size={width * 0.75}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
                <View style={styles.qrCodeFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>
            </View>

            <View style={styles.userInfoContainer}>
              <Text style={styles.userCodeLabel}>Your Payment Code:</Text>
              <TouchableOpacity 
                onPress={handleCopyCode}
                activeOpacity={0.7}
              >
                <Text style={styles.userCode}>{userPaymentCode}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Icon name="share-variant" size={20} color="#1B1B1B" />
              <Text style={styles.shareButtonText}>Share QR Code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load payment code</Text>
          </View>
        )}
      </View>

      <Modal
        visible={showHelpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHelpModal(false)}
        >
          <TouchableOpacity
            style={styles.helpContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.helpHeader}>
              <Text style={styles.helpTitle}>How to use</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowHelpModal(false)}
              >
                <Icon name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.helpContent}>
              <View style={styles.helpItem}>
                <Icon name="qrcode-scan" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Scan QR Code</Text>
                  <Text style={styles.helpItemText}>
                    Ask others to scan this QR code using the TSAMAYA app
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="send" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Send Transport Fare</Text>
                  <Text style={styles.helpItemText}>
                    They can send you transport fare directly through the app
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="wallet" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Instant Transfer</Text>
                  <Text style={styles.helpItemText}>
                    Funds will be added to your wallet instantly
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  helpButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 34,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 19,
    fontWeight: '500',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  qrCodeWrapper: {
    position: 'relative',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.75 + 48,
    minHeight: width * 0.75 + 48,
  },
  qrCodeFrame: {
    position: 'absolute',
    width: width * 0.75 + 48,
    height: width * 0.75 + 48,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ACB2',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  userInfoContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  userCodeLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginBottom: 8,
  },
  userCode: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#00ACB2',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 0,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  helpContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#222325',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 20,
    padding: 24,
  },
  helpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 5,
  },
  helpContent: {
    gap: 20,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  helpItemText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FF6B6B',
    textAlign: 'center',
  },
});

