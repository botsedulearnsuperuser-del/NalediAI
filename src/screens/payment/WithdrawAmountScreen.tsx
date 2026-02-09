import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Text, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface RouteParams {
  provider?: string;
}

export default function WithdrawAmountScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const [amount, setAmount] = useState(''); // Start empty, not '0'
  const amountInputRef = useRef<TextInput>(null);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>Withdraw transport fare</Text>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Enter Amount</Text>
            <Text style={styles.subtitle}>How much would you like to withdraw?</Text>

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
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, (!amount || amount === '0' || getNumericAmount() <= 0) && styles.nextButtonDisabled]}
            onPress={() => {
              const finalAmount = getFullAmount();
              const numericAmount = getNumericAmount();
              if (numericAmount > 0) {
                Keyboard.dismiss();
                navigation.navigate('ConfirmWithdrawal' as never, {
                  amount: finalAmount,
                  provider: params?.provider,
                } as never);
              }
            }}
            activeOpacity={0.8}
            disabled={!amount || amount === '0' || getNumericAmount() <= 0}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
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
    width: 250,
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
});

