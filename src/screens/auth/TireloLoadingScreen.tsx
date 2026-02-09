import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const Skeleton = ({ width, height, style }: any) => {
    const opacity = new Animated.Value(0.3);
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, []);
    return <Animated.View style={[{ opacity, backgroundColor: '#CCD6DD', borderRadius: 12 }, style, width ? { width } : {}, height ? { height } : {}]} />;
};

export default function TireloLoadingScreen({ route }: any) {
    const navigation = useNavigation();
    const target = route?.params?.target || 'TireloHome';

    useEffect(() => {
        // Navigate after delay
        setTimeout(() => {
            navigation.navigate(target as never);
        }, 3000);
    }, [target]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.content}>

                {/* Header Shadow */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {/* Logo Circle */}
                        <Skeleton width={40} height={40} style={{ marginRight: 10 }} />
                        {/* "naledi.ai" */}
                        <Skeleton width={100} height={30} />
                    </View>
                    {/* Learn Button */}
                    <Skeleton width={80} height={40} />
                </View>

                {/* Greeting Lines */}
                <View style={{ marginBottom: 20 }}>
                    <Skeleton width={200} height={24} style={{ marginBottom: 10 }} />
                    <Skeleton width={280} height={16} />
                </View>

                {/* Banner Buttons (Checkup/Mood) */}
                <View style={styles.bannerButtons}>
                    <Skeleton width={140} height={40} style={{ borderRadius: 15 }} />
                    <Skeleton width={100} height={40} style={{ borderRadius: 15 }} />
                </View>

                {/* Section Title */}
                <Skeleton width={150} height={20} style={{ marginBottom: 15, marginTop: 20 }} />

                {/* Tasks Container Mirror (Big Card + 2 Small Cards) */}
                <View style={styles.tasksContainer}>
                    {/* Left: Continue Card */}
                    <Skeleton style={{ flex: 1, height: 200, borderRadius: 20 }} />

                    {/* Right: Small Cards */}
                    <View style={styles.rightTasks}>
                        <Skeleton width="100%" height={92} style={{ borderRadius: 20 }} />
                        <Skeleton width="100%" height={92} style={{ borderRadius: 20 }} />
                    </View>
                </View>

                {/* Recent Sessions Shadow */}
                <View style={styles.sessionHeader}>
                    <Skeleton width={150} height={20} />
                    <Skeleton width={60} height={20} />
                </View>

                <View style={{ marginTop: 15 }}>
                    <Skeleton width="100%" height={70} style={{ marginBottom: 15, borderRadius: 15 }} />
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0E0E0',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    tasksContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
    },
    rightTasks: {
        flex: 1,
        gap: 15,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    }
});
