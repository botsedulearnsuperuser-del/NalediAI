import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface RouteParams {
  qrData?: string;
}

export default function SendAmountScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const [amount, setAmount] = useState('');

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (!numericValue) return '';
    if (numericValue.includes('.')) {
      const parts = numericValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1]?.substring(0, 2) || '';
      return `${integerPart}.${decimalPart.padEnd(2, '0')}`;
    }
    return `${numericValue}.00`;
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setAmount(formatted);
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
        <Text style={styles.headerTitle}>Send Transport Fare</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Amount</Text>
        <Text style={styles.subtitle}>How much would you like to send?</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currency}>P</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.quickAmounts}>
          <TouchableOpacity style={styles.quickAmountButton} onPress={() => setAmount('50.00')}>
            <Text style={styles.quickAmountText}>P50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAmountButton} onPress={() => setAmount('100.00')}>
            <Text style={styles.quickAmountText}>P100</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAmountButton} onPress={() => setAmount('200.00')}>
            <Text style={styles.quickAmountText}>P200</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAmountButton} onPress={() => setAmount('500.00')}>
            <Text style={styles.quickAmountText}>P500</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !amount && styles.nextButtonDisabled]}
          onPress={() => {
            if (amount) {
              navigation.navigate('PasswordConfirm' as never, { 
                amount, 
                qrData: params?.qrData 
              } as never);
            }
          }}
          activeOpacity={0.8}
          disabled={!amount}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
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
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    paddingTop: 40,
  },
  title: {
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
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
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
    paddingHorizontal: 37,
    paddingBottom: 40,
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

