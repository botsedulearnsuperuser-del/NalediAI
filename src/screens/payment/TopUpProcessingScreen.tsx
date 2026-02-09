import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { transactionService } from '../../services/transactionService';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  amount?: string;
  provider?: string;
}

export default function TopUpProcessingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processTopUp = async () => {
      if (!params?.amount || !params?.provider) {
        Alert.alert('Error', 'Missing transaction details');
        navigation.goBack();
        return;
      }

      const amount = parseFloat(params.amount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert('Error', 'Invalid amount');
        navigation.goBack();
        return;
      }

      const { transaction, error } = await transactionService.topUp({
        amount,
        provider: params.provider,
      });

      if (error) {
        Alert.alert('Error', error);
        navigation.goBack();
        return;
      }

      // Wait a bit for the transaction to process, then navigate
      setTimeout(() => {
        setProcessing(false);
        navigation.replace('TopUpComplete' as never, {
          amount: params?.amount,
          provider: params?.provider,
          transactionId: transaction?.transaction_id || transaction?.id,
        } as never);
      }, 2000);
    };

    processTopUp();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(40, 47, 63, 1)', 'rgba(11, 19, 29, 1)', 'rgba(40, 47, 63, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#00ACB2" />
          <Text style={styles.title}>Processing Top-Up</Text>
          <Text style={styles.subtitle}>Please wait while we process your top-up...</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    marginTop: 30,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    textAlign: 'center',
    lineHeight: 24,
  },
});

