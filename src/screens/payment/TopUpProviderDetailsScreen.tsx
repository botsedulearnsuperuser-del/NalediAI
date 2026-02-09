import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  amount?: string;
  provider?: string;
}

export default function TopUpProviderDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  
  const amount = params?.amount || '100.00';
  const provider = params?.provider || 'mascom';

  const getProviderName = () => {
    switch (provider) {
      case 'mascom':
        return 'Mascom Money';
      case 'orange':
        return 'OrangeMoney';
      case 'btc':
        return 'BTC Smega';
      default:
        return 'Payment Provider';
    }
  };

  const getProviderImage = () => {
    switch (provider) {
      case 'mascom':
        return require('../../../assets/images/mascom-money.png');
      case 'orange':
        return require('../../../assets/images/orange-money.png');
      case 'btc':
        return require('../../../assets/images/btc-smega.png');
      default:
        return require('../../../assets/images/mascom-money.png');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Top up transport fare</Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Provider Logo and Name */}
        <View style={styles.providerSection}>
          <Image
            source={getProviderImage()}
            style={styles.providerImage}
            resizeMode="contain"
          />
          <Text style={styles.providerName}>{getProviderName()}</Text>
        </View>

        {/* Amount to Top Up */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount to Top Up</Text>
          <View style={styles.amountValueContainer}>
            <Text style={styles.amountValue}>P{amount}</Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Provider</Text>
            <Text style={styles.detailValue}>{getProviderName()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Fee</Text>
            <Text style={styles.detailValue}>P0.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>P{amount}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            navigation.navigate('TopUpOTP' as never, {
              amount,
              provider,
            } as never);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Continue</Text>
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
  },
  contentContainer: {
    paddingHorizontal: 37,
    paddingTop: 140,
    paddingBottom: 20,
  },
  providerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  providerImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginBottom: 8,
  },
  amountValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountValue: {
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#00ACB2',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#222325',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
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
  divider: {
    height: 1,
    backgroundColor: '#414141',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#00ACB2',
  },
  buttonContainer: {
    paddingHorizontal: 37,
    paddingBottom: 40,
    paddingTop: 10,
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
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
});



