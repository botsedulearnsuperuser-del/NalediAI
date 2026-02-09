import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

// Scan to Pay screen - Figma node 2046:23
export default function ScanToPayScreen() {
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
          <Text style={styles.headerTitle}>Scan to Pay</Text>
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
          <Text style={styles.headerTitle}>Scan to Pay</Text>
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
        <Text style={styles.headerTitle}>Scan to Pay</Text>
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
              <Text style={styles.helpTitle}>How to Pay for a Ride</Text>
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
                    Scan the QR code displayed in the vehicle (Taxi, Combi, Bus, Cab, or Nkago Thusa)
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="cash" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Enter Amount</Text>
                  <Text style={styles.helpItemText}>
                    Enter the fare amount for your ride
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="lock" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Confirm Password</Text>
                  <Text style={styles.helpItemText}>
                    Enter your password to authorize the payment
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="check-circle" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Complete Payment</Text>
                  <Text style={styles.helpItemText}>
                    Review and confirm the payment. Your fare will be deducted from your wallet
                  </Text>
                </View>
              </View>
              <View style={styles.helpItem}>
                <Icon name="car" size={24} color="#00ACB2" style={styles.helpIcon} />
                <View style={styles.helpTextContainer}>
                  <Text style={styles.helpItemTitle}>Supported Vehicles</Text>
                  <Text style={styles.helpItemText}>
                    Pay for Taxi, Combi, Bus, Cab, and Nkago Thusa rides using TSAMAYA
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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

