import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Modal, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  provider?: string;
}

export default function PaymentAmountScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const [amount, setAmount] = useState(''); // Only store the whole number part
  const amountInputRef = useRef<TextInput>(null);
  
  // Modal states
  const [showModal1, setShowModal1] = useState(false); // Deposit Processing
  const [showModal2, setShowModal2] = useState(false); // Confirm Transfer
  const [showModal3, setShowModal3] = useState(false); // Processing Transfer
  const [showModal4, setShowModal4] = useState(false); // Top Up Successful
  
  // Provider info - default to OrangeMoney
  const provider = params?.provider || 'orange';
  const providerName = provider === 'orange' ? 'OrangeMoney' : provider === 'mascom' ? 'Mascom Money' : 'BTC Smega';
  const providerAccount = provider === 'orange' ? '74425925' : provider === 'mascom' ? '12345678' : '87654321';

  const handleAmountChange = (value: string) => {
    // Only allow numbers (no decimal point, no letters, no special chars)
    const cleaned = value.replace(/[^0-9]/g, '');
    
    // If empty, set to empty string (not '0')
    if (cleaned === '') {
      setAmount('');
      return;
    }
    
    // Remove leading zeros and convert to number then back to string
    const numericValue = String(parseInt(cleaned, 10) || 0);
    setAmount(numericValue);
  };

  const getFullAmount = () => {
    // If empty, return '0.00', otherwise return with .00 suffix
    return amount === '' ? '0.00' : `${amount}.00`;
  };

  const getNumericAmount = () => {
    return parseFloat(getFullAmount());
  };

  const handleNext = () => {
    const finalAmount = getFullAmount();
    const numericAmount = getNumericAmount();
    if (numericAmount > 0) {
      Keyboard.dismiss();
      setShowModal1(true); // Show first modal
    }
  };

  const handleModal1OK = () => {
    setShowModal1(false);
    setShowModal2(true); // Show confirm transfer modal
  };

  const handleModal2Transfer = () => {
    setShowModal2(false);
    setShowModal3(true); // Show processing modal
    
    // After 2 seconds, show success modal
    setTimeout(() => {
      setShowModal3(false);
      setShowModal4(true);
    }, 2000);
  };

  const handleModal2Cancel = () => {
    setShowModal2(false);
  };

  const handleModal4Continue = () => {
    setShowModal4(false);
    // Navigate directly to Home screen
    navigation.navigate('Home' as never);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>Top up transport fare</Text>

          <View style={styles.content}>
            <Text style={styles.contentTitle}>Enter Amount</Text>
            <Text style={styles.subtitle}>How much would you like to top up?</Text>

            <TouchableWithoutFeedback onPress={() => amountInputRef.current?.focus()}>
              <View style={styles.amountContainer}>
                <Text style={styles.currency}>P</Text>
                <TextInput
                  ref={amountInputRef}
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <Text style={styles.decimalPart}>.00</Text>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.quickAmounts}>
              <TouchableOpacity style={styles.quickAmountButton} onPress={() => {
                setAmount('50');
                Keyboard.dismiss();
              }}>
                <Text style={styles.quickAmountText}>P50</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAmountButton} onPress={() => {
                setAmount('100');
                Keyboard.dismiss();
              }}>
                <Text style={styles.quickAmountText}>P100</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAmountButton} onPress={() => {
                setAmount('200');
                Keyboard.dismiss();
              }}>
                <Text style={styles.quickAmountText}>P200</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAmountButton} onPress={() => {
                setAmount('500');
                Keyboard.dismiss();
              }}>
                <Text style={styles.quickAmountText}>P500</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, (!amount || amount === '' || getNumericAmount() <= 0) && styles.nextButtonDisabled]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!amount || amount === '' || getNumericAmount() <= 0}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal 1: Deposit Processing */}
      <Modal
        visible={showModal1}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal1(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModal1(false)}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.modalContent}>
              <Text style={styles.modal1Title}>
                <Text style={styles.modal1TitleDeposit}>Deposit</Text>
                <Text style={styles.modal1TitleProcessing}> Processing</Text>
              </Text>
              
              <Text style={styles.modal1Body}>
                Please check for an <Text style={styles.modal1Bold}>OrangeMoney</Text>
                {'\n'}Popup confirmation on your mobile
                {'\n'}phone, if there is no pop-up please dial
                {'\n'}<Text style={styles.modal1Bold}>*149#</Text> to check for any pending
                {'\n'}transactions from <Text style={styles.modal1Bold}>Tsamaya</Text>
              </Text>
              
              <TouchableOpacity
                style={styles.modal1OKButton}
                onPress={handleModal1OK}
              >
                <Text style={styles.modal1OKButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Confirm Transfer */}
      <Modal
        visible={showModal2}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal2(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleModal2Cancel}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.modalContent}>
              <Text style={styles.modal2Title}>Confirm Transfer</Text>
              
              <View style={styles.modal2AmountContainer}>
                <Text style={styles.modal2AmountP}>P</Text>
                <Text style={styles.modal2AmountNumber}>{amount}</Text>
                <Text style={styles.modal2AmountDecimal}>.00</Text>
              </View>
              
              <Text style={styles.modal2FromLabel}>From {providerName}:</Text>
              <Text style={styles.modal2Account}>{providerAccount}</Text>
              
              <View style={styles.modal2Buttons}>
                <TouchableOpacity
                  style={styles.modal2TransferButton}
                  onPress={handleModal2Transfer}
                >
                  <Text style={styles.modal2TransferButtonText}>Transfer</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modal2CancelButton}
                  onPress={handleModal2Cancel}
                >
                  <Text style={styles.modal2CancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 3: Processing Transfer */}
      <Modal
        visible={showModal3}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modal3Title}>Processing Transfer</Text>
              
              <View style={styles.modal3AmountContainer}>
                <Text style={styles.modal3AmountP}>P</Text>
                <Text style={styles.modal3AmountNumber}>{amount}</Text>
                <Text style={styles.modal3AmountDecimal}>.00</Text>
              </View>
              
              <Text style={styles.modal3FromLabel}>From {providerName}</Text>
              
              <ActivityIndicator size="large" color="#FF6B9D" style={styles.modal3Loader} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 4: Top Up Successful */}
      <Modal
        visible={showModal4}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modal4Title}>Top Up Successful</Text>
              
              <View style={styles.modal4SuccessIcon}>
                <View style={styles.modal4SuccessCircle}>
                  <Icon name="check" size={60} color="#00ACB2" />
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.modal4Button}
                onPress={handleModal4Continue}
              >
                <Text style={styles.modal4ButtonText}>Go to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  backButton: {
    position: 'absolute',
    left: 21,
    top: 46,
    width: 34.63,
    height: 34.63,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    transform: [{ rotate: '-90deg' }],
  },
  title: {
    position: 'absolute',
    left: 90,
    top: 50,
    fontSize: 19,
    fontWeight: '500',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    lineHeight: 28,
    width: 196,
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    paddingTop: 140,
  },
  contentTitle: {
    fontSize: 19,
    fontWeight: '500',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginBottom: 40,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00ACB2',
    paddingBottom: 10,
    marginBottom: 40,
  },
  currency: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    marginRight: 10,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    minWidth: 50,
    padding: 0,
    marginRight: -2,
  },
  decimalPart: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    marginLeft: -2,
    padding: 0,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  quickAmountButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 80,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FFFFFF',
  },
  buttonContainer: {
    position: 'absolute',
    left: 37,
    top: 706,
    width: 305,
    height: 45,
  },
  nextButton: {
    backgroundColor: '#00ACB2',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#222325',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#414141',
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  // Modal 1: Deposit Processing
  modal1Title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Archivo',
    marginBottom: 24,
    textAlign: 'center',
  },
  modal1TitleDeposit: {
    color: '#00ACB2',
  },
  modal1TitleProcessing: {
    color: '#FFFFFF',
  },
  modal1Body: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modal1Bold: {
    fontWeight: '700',
  },
  modal1OKButton: {
    backgroundColor: '#00ACB2',
    borderRadius: 11,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal1OKButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
  // Modal 2: Confirm Transfer
  modal2Title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  modal2AmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modal2AmountP: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#00ACB2',
  },
  modal2AmountNumber: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#00ACB2',
  },
  modal2AmountDecimal: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
  },
  modal2FromLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  modal2Account: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  modal2Buttons: {
    width: '100%',
    gap: 12,
  },
  modal2TransferButton: {
    backgroundColor: '#00ACB2',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal2TransferButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
  modal2CancelButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal2CancelButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  // Modal 3: Processing Transfer
  modal3Title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  modal3AmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modal3AmountP: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#00ACB2',
  },
  modal3AmountNumber: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#00ACB2',
  },
  modal3AmountDecimal: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
  },
  modal3FromLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  modal3Loader: {
    marginTop: 20,
  },
  // Modal 4: Top Up Successful
  modal4Title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  modal4SuccessIcon: {
    marginBottom: 32,
  },
  modal4SuccessCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00ACB2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  modal4Button: {
    backgroundColor: '#00ACB2',
    borderRadius: 11,
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal4ButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
});

