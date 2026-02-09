import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function WithdrawScreen() {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Withdraw transport fare</Text>
      <Text style={styles.subtitle}>Choose a payment provider</Text>

      <View style={styles.providerContainer}>
        <TouchableOpacity
          style={[styles.mascomCard, selectedProvider === 'mascom' && styles.providerCardSelected]}
          onPress={() => setSelectedProvider('mascom')}
        >
          <View style={styles.mascomIconContainer}>
            <Image
              source={require('../../../assets/images/mascom-money.png')}
              style={styles.providerIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.orangeCard, selectedProvider === 'orange' && styles.providerCardSelected]}
          onPress={() => setSelectedProvider('orange')}
        >
          <View style={styles.orangeIconContainer}>
            <Image
              source={require('../../../assets/images/orange-money.png')}
              style={styles.providerIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.orangeTextContainer}>
            <Text style={styles.orangeText}>OrangeMoney</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btcCard, selectedProvider === 'btc' && styles.providerCardSelected]}
          onPress={() => setSelectedProvider('btc')}
        >
          <View style={styles.btcIconContainer}>
            <Image
              source={require('../../../assets/images/btc-smega.png')}
              style={styles.btcIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.btcText}>BTC Smega</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedProvider && styles.nextButtonDisabled]}
          onPress={() => {
            if (selectedProvider) {
              navigation.navigate('WithdrawAmount' as never, { provider: selectedProvider } as never);
            }
          }}
          activeOpacity={0.8}
          disabled={!selectedProvider}
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
  backButton: {
    position: 'absolute',
    left: 21,
    top: 46,
    width: 34.63,
    height: 34.63,
    zIndex: 1,
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
    width: 220,
  },
  subtitle: {
    position: 'absolute',
    left: 78,
    top: 115,
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    lineHeight: 27,
    width: 226,
  },
  providerContainer: {
    position: 'absolute',
    top: 164,
    left: 0,
    right: 0,
    paddingHorizontal: 37,
  },
  mascomCard: {
    position: 'absolute',
    left: 37,
    top: 167,
    width: 139,
    height: 145,
    borderWidth: 3,
    borderColor: '#383838',
    borderRadius: 14,
    backgroundColor: '#FDE704',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangeCard: {
    position: 'absolute',
    left: 34,
    top: 0,
    width: 139,
    height: 145,
    borderWidth: 3,
    borderColor: '#383838',
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 12,
  },
  btcCard: {
    position: 'absolute',
    left: 200,
    top: -2,
    width: 139,
    height: 145,
    borderWidth: 3,
    borderColor: '#383838',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 38,
  },
  providerCardSelected: {
    borderColor: '#00ACB2',
  },
  mascomIconContainer: {
    width: 125,
    height: 125,
  },
  providerIcon: {
    width: '100%',
    height: '100%',
  },
  orangeIconContainer: {
    width: 116,
    height: 116,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  orangeTextContainer: {
    width: 113,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  orangeText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Archivo',
    lineHeight: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  btcIconContainer: {
    width: 69,
    height: 69,
    marginBottom: 10,
  },
  btcIcon: {
    width: '100%',
    height: '100%',
  },
  btcText: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Archivo',
    lineHeight: 20,
    color: '#0B6A30',
    textAlign: 'center',
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
    width: '100%',
    height: '100%',
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

