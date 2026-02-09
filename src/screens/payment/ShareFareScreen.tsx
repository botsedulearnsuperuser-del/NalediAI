import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function ShareFareScreen() {
  const navigation = useNavigation();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPaymentCodeModal, setShowPaymentCodeModal] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');
  const [scanning, setScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    
    // Navigate directly to amount entry screen with scanned QR data
    navigation.navigate('SendAmount' as never, { qrData: data } as never);
    setScanned(false);
  };

  const handleUsePaymentCode = () => {
    setShowPaymentCodeModal(true);
  };

  const handlePaymentCodeSubmit = () => {
    if (!paymentCode.trim()) {
      Alert.alert('Error', 'Please enter a payment code');
      return;
    }

    // Validate payment code format (should start with TSAMAYA_)
    if (!paymentCode.trim().startsWith('TSAMAYA_')) {
      Alert.alert('Error', 'Invalid payment code format. Payment codes start with TSAMAYA_');
      return;
    }

    setShowPaymentCodeModal(false);
    // Navigate to amount entry screen with manually entered payment code
    navigation.navigate('SendAmount' as never, { qrData: paymentCode.trim() } as never);
    setPaymentCode('');
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Fare</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => setShowHelpModal(true)}
          >
            <Icon name="help-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Fare</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => setShowHelpModal(true)}
          >
            <Icon name="help-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Fare</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelpModal(true)}
        >
          <Icon name="help-circle-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scannerText}>Position QR code within the frame</Text>
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <Icon 
            name={flashEnabled ? "flashlight" : "flashlight-off"} 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.flashButtonText}>Flash</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.paymentCodeButton}
          onPress={handleUsePaymentCode}
        >
          <Icon name="keyboard" size={20} color="#00ACB2" />
          <Text style={styles.paymentCodeButtonText}>Use Payment Code</Text>
        </TouchableOpacity>
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
              <Text style={styles.helpTitle}>How to Share Fare</Text>
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
                    Scan the QR code from another user's Request Fare screen
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="cash" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Enter Amount</Text>
                  <Text style={styles.helpItemText}>
                    Enter the amount you wish to send or share
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="lock" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Confirm Password</Text>
                  <Text style={styles.helpItemText}>
                    Enter your password to confirm the transaction
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="check-circle" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Complete Transfer</Text>
                  <Text style={styles.helpItemText}>
                    Review and confirm the transfer details
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Payment Code Input Modal */}
      <Modal
        visible={showPaymentCodeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowPaymentCodeModal(false);
          setPaymentCode('');
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowPaymentCodeModal(false);
            setPaymentCode('');
          }}
        >
          <TouchableOpacity
            style={styles.paymentCodeModalContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.paymentCodeModalHeader}>
              <Text style={styles.paymentCodeModalTitle}>Enter Payment Code</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPaymentCodeModal(false);
                  setPaymentCode('');
                }}
              >
                <Icon name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentCodeModalContent}>
              <Text style={styles.paymentCodeModalSubtitle}>
                Enter the recipient's payment code to send transport fare
              </Text>
              
              <View style={styles.paymentCodeInputContainer}>
                <TextInput
                  style={styles.paymentCodeInput}
                  placeholder="TSAMAYA_XXXXXXXXXXXX"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={paymentCode}
                  onChangeText={setPaymentCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              
              <TouchableOpacity
                style={[styles.paymentCodeSubmitButton, !paymentCode.trim() && styles.paymentCodeSubmitButtonDisabled]}
                onPress={handlePaymentCodeSubmit}
                disabled={!paymentCode.trim()}
              >
                <Text style={styles.paymentCodeSubmitButtonText}>Continue</Text>
              </TouchableOpacity>
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
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#00ACB2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
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
  scannerText: {
    marginTop: 40,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 20,
  },
  flashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  flashButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  paymentCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 172, 178, 0.1)',
    borderWidth: 1,
    borderColor: '#00ACB2',
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  paymentCodeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#00ACB2',
  },
  paymentCodeModalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#222325',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
  },
  paymentCodeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentCodeModalTitle: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  paymentCodeModalContent: {
    gap: 20,
  },
  paymentCodeModalSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    lineHeight: 22,
  },
  paymentCodeInputContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    backgroundColor: '#1B1B1B',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paymentCodeInput: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  paymentCodeSubmitButton: {
    backgroundColor: '#00ACB2',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  paymentCodeSubmitButtonDisabled: {
    opacity: 0.5,
  },
  paymentCodeSubmitButtonText: {
    fontSize: 15,
    fontWeight: '600',
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
});

