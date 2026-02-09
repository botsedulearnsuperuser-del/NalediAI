import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '../../components/GradientText';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  amount?: string;
  provider?: string;
  transactionId?: string;
}

export default function TopUpCompleteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const amount = params?.amount || '100.00';
  const provider = params?.provider || 'Mascom Money';
  const transactionId = params?.transactionId || `TXN${Date.now().toString().slice(-9)}`;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(40, 47, 63, 1)', 'rgba(11, 19, 29, 1)', 'rgba(40, 47, 63, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name="check-circle" size={80} color="#00ACB2" />
          </View>

          <Text style={styles.title}>Top-Up Successful!</Text>
          <Text style={styles.subtitle}>Your account has been topped up successfully</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount Added</Text>
            <GradientText
              colors={['rgba(2, 171, 176, 1)', 'rgba(177, 217, 217, 1)', 'rgba(0, 172, 178, 1)', 'rgba(255, 255, 255, 1)']}
              style={styles.amountValue}
            >
              P{amount}
            </GradientText>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{transactionId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Provider</Text>
              <Text style={styles.detailValue}>{provider}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.navigate('Home' as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
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
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 11,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 37,
  },
  doneButton: {
    backgroundColor: '#00ACB2',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
});

