import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function GetSupportScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-up" size={34.63} color="#FFFFFF" style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Get Support</Text>

      <View style={styles.content}>
        <Text style={styles.contentTitle}>How can we help you?</Text>
        <Text style={styles.subtitle}>
          Contact our support team for assistance with your account, transactions, or any questions you may have.
        </Text>
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
    width: 220,
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
    lineHeight: 22,
  },
});

