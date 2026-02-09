import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GradientText from '../../components/GradientText';

const { width } = Dimensions.get('window');

interface RouteParams {
  amount?: string;
  provider?: string;
  otp?: string;
}

export default function TopUpPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const amount = params?.amount || '100.00';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    // Verify password (in production, verify with backend)
    navigation.navigate('TopUpFinalConfirm' as never, {
      amount,
      provider: params?.provider,
      otp: params?.otp,
    } as never);
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
        <Text style={styles.headerTitle}>Top up transport fare</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <GradientText
            colors={['rgba(2, 171, 176, 1)', 'rgba(177, 217, 217, 1)', 'rgba(0, 172, 178, 1)', 'rgba(255, 255, 255, 1)']}
            style={styles.amountValue}
          >
            P{amount}
          </GradientText>
        </View>

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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, !password && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={!password}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
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
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    paddingTop: 40,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  amountLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginBottom: 12,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins',
    textAlign: 'center',
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



