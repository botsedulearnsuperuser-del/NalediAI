import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface RouteParams {
  amount?: string;
  qrData?: string;
}

export default function PasswordConfirmScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    
    // In production, verify password with backend
    // For now, simulate verification
    setTimeout(() => {
      setLoading(false);
      // Navigate to payment processing screen
      navigation.navigate('PaymentProcessing' as never, {
        amount: params?.amount,
        qrData: params?.qrData,
      } as never);
    }, 500);
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
        <Text style={styles.headerTitle}>Confirm Password</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Your Password</Text>
        <Text style={styles.subtitle}>
          Please enter your password to confirm this transaction
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#B1B2B4"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.amountDisplay}>
          <Text style={styles.amountLabel}>Amount to Send</Text>
          <Text style={styles.amountValue}>P{params?.amount || '0.00'}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, (!password || loading) && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={!password || loading}
        >
          <Text style={styles.confirmButtonText}>
            {loading ? 'Verifying...' : 'Confirm'}
          </Text>
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
    lineHeight: 22,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#00ACB2',
    paddingBottom: 10,
    marginBottom: 40,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 5,
  },
  amountDisplay: {
    backgroundColor: '#222325',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    padding: 20,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 37,
    paddingBottom: 40,
  },
  confirmButton: {
    backgroundColor: '#00ACB2',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
});

