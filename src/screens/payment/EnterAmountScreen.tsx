import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Placeholder screen for Figma node 2016:59
export default function EnterAmountScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top up transport fare</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.iconContainer}>
        <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.headerIcon} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Amount</Text>
        <Text style={styles.subtitle}>How much would you like to top up?</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currency}>P</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !amount && styles.nextButtonDisabled]}
          onPress={() => {
            if (amount) {
              navigation.navigate('PaymentConfirmation' as never);
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
    paddingHorizontal: 21,
    paddingTop: 46,
    paddingBottom: 20,
  },
  backButton: {
    width: 34.63,
    height: 34.63,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    transform: [{ rotate: '-90deg' }],
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '500',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    lineHeight: 28,
    flex: 1,
    textAlign: 'center',
    marginLeft: -34.63,
    zIndex: 10,
  },
  placeholder: {
    width: 34.63,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    width: '100%',
    height: 50,
  },
  headerIcon: {
    transform: [{ rotate: '-90deg' }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    paddingTop: 20,
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
  buttonContainer: {
    paddingHorizontal: 37,
    paddingBottom: 20,
    paddingTop: 20,
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

