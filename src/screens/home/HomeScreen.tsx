import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SvgXml } from 'react-native-svg';
import GradientText from '../../components/GradientText';
import { transactionService } from '../../services/transactionService';
import { supabase } from '../../config/supabase';
import * as Notifications from 'expo-notifications';

// SVG icon strings
const transferIcon = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M38.7671 17.9269L19.4064 41.2329L17.3219 25.9612M25.233 46.0731L44.5936 22.767L46.6781 38.0387" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const sendIcon = `<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.1787 10.5963C36.313 10.7514 35.1309 11.1434 33.4078 11.7192L20.1573 16.1353C18.477 16.6947 17.2582 17.101 16.37 17.4481C15.4472 17.8074 15.043 18.0463 14.8735 18.2076C14.5758 18.4934 14.339 18.8364 14.1772 19.216C14.0155 19.5956 13.9321 20.004 13.9321 20.4167C13.9321 20.8293 14.0155 21.2377 14.1772 21.6174C14.339 21.997 14.5758 22.34 14.8735 22.6258C15.043 22.7891 15.4472 23.0259 16.37 23.3853C17.6482 23.8604 18.9369 24.3069 20.2349 24.7246C20.8311 24.9227 21.2435 25.0594 21.6171 25.2575C22.5221 25.7369 23.2619 26.4774 23.7405 27.3829C23.9405 27.7565 24.0773 28.1689 24.2754 28.7651L24.3019 28.8447C24.8613 30.5229 25.2676 31.7439 25.6147 32.6299C25.974 33.5528 26.2129 33.957 26.3763 34.1265C26.662 34.4238 27.0049 34.6604 27.3843 34.822C27.7638 34.9836 28.1719 35.0669 28.5843 35.0669C28.9967 35.0669 29.4049 34.9836 29.7843 34.822C30.1637 34.6604 30.5066 34.4238 30.7924 34.1265C30.9557 33.957 31.1925 33.5528 31.5519 32.6299C31.899 31.7439 32.3073 30.5229 32.8647 28.8447L37.2828 15.5922C37.8565 13.8691 38.2485 12.6849 38.4017 11.8213C38.5568 10.9474 38.4037 10.7494 38.3261 10.6739C38.2506 10.5963 38.0525 10.4411 37.1787 10.5963ZM36.8214 8.58932C37.8627 8.40557 38.955 8.41578 39.7716 9.2304C40.5863 10.0471 40.5965 11.1394 40.4127 12.1806C40.229 13.2117 39.788 14.5367 39.249 16.1557L39.2183 16.2374L34.8022 29.4919L34.792 29.5225C34.3748 30.8165 33.9289 32.101 33.4547 33.3752C33.0974 34.2857 32.7401 35.0493 32.2644 35.5434C31.7881 36.0393 31.2165 36.4338 30.584 36.7033C29.9514 36.9729 29.2709 37.1118 28.5833 37.1118C27.8957 37.1118 27.2152 36.9729 26.5826 36.7033C25.9501 36.4338 25.3785 36.0393 24.9022 35.5434C24.4285 35.0473 24.0692 34.2857 23.7119 33.3752C23.3444 32.4339 22.9218 31.164 22.3746 29.5225L22.3644 29.4919C22.1296 28.7875 22.0459 28.5466 21.9356 28.3404C21.6486 27.7968 21.2047 27.3522 20.6616 27.0644C20.4575 26.9562 20.2145 26.8724 19.5101 26.6356L19.4795 26.6274C18.1858 26.2096 16.9013 25.7638 15.6269 25.2902C14.7163 24.9329 13.9527 24.5756 13.4586 24.0999C12.9627 23.6236 12.5682 23.052 12.2987 22.4194C12.0292 21.7868 11.8903 21.1063 11.8903 20.4187C11.8903 19.7312 12.0292 19.0507 12.2987 18.4181C12.5682 17.7855 12.9627 17.2139 13.4586 16.7376C13.9548 16.2619 14.7163 15.9046 15.6269 15.5473C16.5681 15.1798 17.838 14.7572 19.4795 14.21L19.5101 14.1998L32.7626 9.7837L32.8463 9.75511C34.4653 9.21611 35.7904 8.77511 36.8214 8.59136" fill="white"/>
</svg>`;

const cardTransferIcon = `<svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.1667 7.66666C11.939 7.66666 8.32412 7.66666 6.07971 9.91299C3.83529 12.1593 3.83337 15.7722 3.83337 23C3.83337 30.2277 3.83337 33.8426 6.07971 36.087C8.32604 38.3314 11.939 38.3333 19.1667 38.3333H22.0417M26.8334 7.66666C34.0611 7.66666 37.676 7.66666 39.9204 9.91299C41.9597 11.9504 42.1475 15.1148 42.1667 21.0833" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
<path d="M29.7083 26.8333V38.3333M29.7083 38.3333L33.5417 34.5M29.7083 38.3333L25.875 34.5M38.3333 38.3333V26.8333M38.3333 26.8333L42.1667 30.6666M38.3333 26.8333L34.5 30.6666" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.1667 30.6667H11.5M3.83337 19.1667H13.4167M42.1667 19.1667H21.0834" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const qrcodeIcon = `<svg width="60" height="44" viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39.1703 24.7913C38.7407 24.4605 38.2403 24.2335 37.7083 24.1283C37.1764 24.023 36.6273 24.0423 36.1041 24.1845L27.6289 26.125C27.9949 25.4993 28.1877 24.7874 28.1875 24.0625C28.1875 22.9685 27.7529 21.9193 26.9793 21.1457C26.2057 20.3721 25.1565 19.9375 24.0625 19.9375H15.4584C14.8262 19.9356 14.1998 20.0591 13.6156 20.3011C13.0314 20.543 12.5011 20.8985 12.0553 21.3469L7.96469 25.4375H2.75C2.20299 25.4375 1.67839 25.6548 1.29159 26.0416C0.904798 26.4284 0.6875 26.953 0.6875 27.5V34.375C0.6875 34.922 0.904798 35.4466 1.29159 35.8334C1.67839 36.2202 2.20299 36.4375 2.75 36.4375H20.625C20.6829 36.4379 20.7407 36.431 20.7969 36.4169L31.7969 33.6669C31.8319 33.6576 31.8664 33.6461 31.9 33.6325L38.5722 30.7897L38.61 30.7725C39.1476 30.5038 39.6079 30.1027 39.9476 29.6069C40.2874 29.1111 40.4953 28.5371 40.5519 27.9387C40.6084 27.3404 40.5118 26.7375 40.271 26.1869C40.0302 25.6362 39.6532 25.1559 39.1755 24.7913H39.1703ZM2.0625 34.375V27.5C2.0625 27.3177 2.13493 27.1428 2.26386 27.0139C2.3928 26.8849 2.56766 26.8125 2.75 26.8125H7.5625V35.0625H2.75C2.56766 35.0625 2.3928 34.9901 2.26386 34.8611C2.13493 34.7322 2.0625 34.5573 2.0625 34.375ZM38.0067 29.5333L31.405 32.3469L20.5408 35.0625H8.9375V26.4103L13.0281 22.3197C13.3465 21.9994 13.7252 21.7454 14.1424 21.5726C14.5595 21.3997 15.0069 21.3113 15.4584 21.3125H24.0625C24.7918 21.3125 25.4913 21.6022 26.007 22.118C26.5228 22.6337 26.8125 23.3332 26.8125 24.0625C26.8125 24.7918 26.5228 25.4913 26.007 26.007C25.4913 26.5228 24.7918 26.8125 24.0625 26.8125H19.25C19.0677 26.8125 18.8928 26.8849 18.7639 27.0139C18.6349 27.1428 18.5625 27.3177 18.5625 27.5C18.5625 27.6823 18.6349 27.8572 18.7639 27.9861C18.8928 28.1151 19.0677 28.1875 19.25 28.1875H24.75C24.802 28.1876 24.8539 28.1819 24.9047 28.1703L36.4203 25.5217H36.4478C36.9638 25.3849 37.5122 25.4435 37.9876 25.6862C38.4631 25.929 38.8321 26.3388 39.0239 26.837C39.2157 27.3352 39.2167 27.8867 39.0267 28.3856C38.8368 28.8845 38.4692 29.2957 37.9947 29.5402L38.0067 29.5333ZM28.1875 15.8125C28.6948 15.8133 29.1997 15.7439 29.688 15.6063C29.9219 16.6835 30.4742 17.6656 31.2731 18.4251C32.0721 19.1847 33.0808 19.6866 34.1685 19.8658C35.2562 20.045 36.3727 19.8933 37.373 19.4302C38.3734 18.9671 39.2116 18.2141 39.7788 17.2689C40.346 16.3237 40.616 15.2298 40.5539 14.1292C40.4918 13.0286 40.1005 11.972 39.4305 11.0966C38.7606 10.2211 37.8431 9.56718 36.7969 9.21958C35.7508 8.87198 34.6244 8.84676 33.5638 9.14719C33.3439 8.13295 32.8415 7.20162 32.1147 6.4608C31.388 5.71998 30.4664 5.1999 29.4566 4.96065C28.4467 4.7214 27.3898 4.77274 26.4079 5.10874C25.426 5.44475 24.5592 6.0517 23.9077 6.85947C23.2561 7.66725 22.8464 8.64288 22.7258 9.67365C22.6053 10.7044 22.7789 11.7483 23.2264 12.6846C23.674 13.6209 24.3774 14.4115 25.2553 14.965C26.1331 15.5185 27.1497 15.8123 28.1875 15.8125ZM39.1875 14.4375C39.1875 15.2533 38.9456 16.0509 38.4923 16.7292C38.0391 17.4076 37.3948 17.9363 36.6411 18.2485C35.8873 18.5607 35.0579 18.6424 34.2578 18.4832C33.4576 18.3241 32.7226 17.9312 32.1457 17.3543C31.5688 16.7774 31.1759 16.0424 31.0168 15.2422C30.8576 14.4421 30.9393 13.6127 31.2515 12.8589C31.5637 12.1052 32.0924 11.4609 32.7708 11.0077C33.4491 10.5544 34.2467 10.3125 35.0625 10.3125C36.1565 10.3125 37.2057 10.7471 37.9793 11.5207C38.7529 12.2943 39.1875 13.3435 39.1875 14.4375ZM28.1875 6.1875C29.1762 6.1874 30.132 6.54239 30.8809 7.18783C31.6298 7.83326 32.122 8.72621 32.2678 9.70406C31.478 10.1688 30.8168 10.8235 30.3444 11.6088C29.8719 12.394 29.6032 13.2848 29.5625 14.2003C28.996 14.4012 28.3925 14.4758 27.7941 14.419C27.1957 14.3622 26.617 14.1754 26.0984 13.8715C25.5798 13.5676 25.1339 13.1541 24.7919 12.6598C24.4499 12.1656 24.22 11.6025 24.1183 11.0102C24.0167 10.4178 24.0457 9.8103 24.2034 9.2303C24.3611 8.6503 24.6436 8.11176 25.0312 7.65238C25.4188 7.193 25.9021 6.82388 26.4473 6.57085C26.9925 6.31781 27.5864 6.18698 28.1875 6.1875Z" fill="#1B1B1B"/>
<path d="M50.4027 2.56927L50.4132 12.8095L46.5695 9.29334M52.9733 12.8068L52.9627 2.56664L56.8064 6.08277" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [balance, setBalance] = useState<string>('0.00');
  const [loading, setLoading] = useState(true);
  const transactionSubscription = useRef<any>(null);
  const notificationListener = useRef<any>(null);

  // Configure notification handler
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Listen for notifications received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      if (data?.type === 'money_received') {
        Alert.alert(
          'Money Received! 💰',
          `You received P${data.amount?.toFixed(2) || '0.00'} from ${data.senderName || 'Someone'}`,
          [{ text: 'OK' }]
        );
        // Refresh balance
        fetchBalance();
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
    };
  }, []);

  const fetchBalance = async () => {
    try {
      const { wallet, error } = await transactionService.getWallet();
      if (wallet && !error) {
        setBalance(wallet.balance.toFixed(2));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for receive transactions
  useEffect(() => {
    const setupTransactionSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove existing subscription if any
      if (transactionSubscription.current) {
        supabase.removeChannel(transactionSubscription.current);
      }

      // Subscribe to receive transactions for this user
      transactionSubscription.current = supabase
        .channel('receive_transactions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id} AND transaction_type=eq.receive`,
          },
          async (payload) => {
            const transaction = payload.new;
            
            // Only show notification if transaction is completed
            if (transaction.status === 'completed') {
              // Get sender's name (recipient_user_id in receive transaction is the sender's ID)
              const senderId = transaction.recipient_user_id;
              const { data: sender } = senderId ? await supabase
                .from('users')
                .select('full_name')
                .eq('id', senderId)
                .single() : { data: null };

              const senderName = sender?.full_name || 'Someone';
              
              // Show alert popup
              Alert.alert(
                'Money Received! 💰',
                `You received P${parseFloat(transaction.amount).toFixed(2)} from ${senderName}`,
                [{ text: 'OK', onPress: () => fetchBalance() }]
              );

              // Send push notification
              try {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: 'Money Received! 💰',
                    body: `You received P${parseFloat(transaction.amount).toFixed(2)} from ${senderName}`,
                    data: {
                      type: 'money_received',
                      amount: transaction.amount,
                      senderName: senderName,
                      transactionId: transaction.transaction_id,
                    },
                    sound: true,
                  },
                  trigger: null, // Send immediately
                });
              } catch (notifError) {
                console.error('Error sending notification:', notifError);
              }

              // Refresh balance
              fetchBalance();
            }
          }
        )
        .subscribe();

      return () => {
        if (transactionSubscription.current) {
          supabase.removeChannel(transactionSubscription.current);
        }
      };
    };

    setupTransactionSubscription();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchBalance();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B1B1B" translucent={false} />
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/tsamaya-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('ScanToPay' as never)}>
          <Icon name="qrcode" size={35} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome back,{'\n'}Your transport fare  balance is
        </Text>

        <View style={styles.balanceContainer}>
          <GradientText
            colors={['rgba(2, 171, 176, 1)', 'rgba(177, 217, 217, 1)', 'rgba(0, 172, 178, 1)', 'rgba(255, 255, 255, 1)']}
            style={styles.balanceAmount}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.5}
          >
            P{loading ? '0.00' : balance}
          </GradientText>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchField}>
            <View style={styles.searchIconContainer}>
              <Icon name="magnify" size={30} color="#14353A" />
            </View>
            <Text style={styles.searchText}>Re ka go thusa Jang</Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.topUpCard]}
            onPress={() => navigation.navigate('TopUp' as never)}
          >
            <View style={styles.iconContainer}>
              <SvgXml xml={transferIcon} width={63.91} height={63.91} />
            </View>
            <Text style={styles.topUpCardText}>Top Up Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Withdraw' as never)}
          >
            <View style={styles.iconContainer}>
              <SvgXml xml={cardTransferIcon} width={46} height={46} />
            </View>
            <Text style={styles.actionCardText}>Withdraw Fare</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('ShareFare' as never)}
          >
            <View style={styles.iconContainer}>
              <SvgXml xml={sendIcon} width={49} height={49} />
            </View>
            <Text style={styles.actionCardText}>Share fare</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, styles.requestCard]}
            onPress={() => navigation.navigate('RequestFare' as never)}
          >
            <View style={styles.iconContainer}>
              <SvgXml xml={qrcodeIcon} width={59.38} height={44} />
            </View>
            <Text style={[styles.actionCardText, styles.requestCardText]}>Request Fare</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => navigation.navigate('GetSupport' as never)}
        >
          <Text style={styles.supportButtonText}>Get Support</Text>
        </TouchableOpacity>

        <View style={styles.logoutContainer}>
          <Text style={styles.versionText}>TSAMAYA v1.0.0</Text>
          <TouchableOpacity 
            style={styles.logoutIconContainer}
            onPress={() => navigation.navigate('RiderSignIn' as never)}
          >
            <Icon name="logout" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
  },
  logo: {
    width: 59,
    height: 59,
  },
  content: {
    flex: 1,
    paddingHorizontal: 34,
  },
  welcomeText: {
    fontSize: 19,
    fontWeight: '900',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 20,
  },
  balanceContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '100%',
    minHeight: 60,
  },
  balanceAmount: {
    fontSize: Math.min(74, Math.max(45, width * 0.18)),
    fontWeight: '700',
    fontFamily: 'Poppins',
    lineHeight: Math.min(74, Math.max(45, width * 0.18)) * 0.9,
    textAlign: 'center',
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '100%',
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
    // Gradient text - would need a library
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchField: {
    backgroundColor: '#222325',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconContainer: {
    width: 47,
    height: 45,
    backgroundColor: '#85C9CF',
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
    marginLeft: 17,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    width: 139 * (width / 375),
    height: 145 * (height / 812),
    borderWidth: 3,
    borderColor: '#383838',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18 * (height / 812),
    paddingBottom: 18 * (height / 812),
    marginBottom: 24 * (height / 812),
    backgroundColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  topUpCard: {
    backgroundColor: '#00A9AC',
  },
  topUpCardText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 0,
    paddingHorizontal: 8,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
  },
  actionCardText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Archivo',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 0,
    paddingHorizontal: 8,
  },
  requestCardText: {
    color: '#1B1B1B',
    marginTop: 0,
    fontWeight: '700',
  },
  supportButton: {
    backgroundColor: '#00ACB2',
    borderWidth: 1,
    borderColor: '#414141',
    borderRadius: 11,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportButtonText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#1B1B1B',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 0,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Archivo',
    color: '#B1B2B4',
  },
  logoutIconContainer: {
    padding: 8,
  },
});

