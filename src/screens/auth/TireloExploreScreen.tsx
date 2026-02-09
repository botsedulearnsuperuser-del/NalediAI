import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../config/supabase';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function TireloExploreScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = React.useState('');
    const [salons, setSalons] = React.useState<any[]>([]);
    const [filteredSalons, setFilteredSalons] = React.useState<any[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchSalons();
        }, [])
    );

    const fetchSalons = async () => {
        try {
            const { data, error } = await supabase.from('salons').select('*');
            if (data) {
                setSalons(data);
                setFilteredSalons(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text) {
            const filtered = salons.filter(salon =>
                salon.name.toLowerCase().includes(text.toLowerCase()) ||
                salon.address.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSalons(filtered);
        } else {
            setFilteredSalons(salons);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.content}>
                {/* Header with Search */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#999" style={{ marginLeft: 10 }} />
                        <TextInput
                            placeholder="Search salons..."
                            style={styles.searchInput}
                            placeholderTextColor="#999"
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                        <TouchableOpacity
                            style={styles.filterBtn}
                            onPress={() => navigation.navigate('TireloFilter' as never)}
                        >
                            <Ionicons name="options-outline" size={20} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Recent Search */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Search</Text>
                        <TouchableOpacity>
                            <Text style={styles.clearAllText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentRow}>
                        {[
                            'Hair Cut', 'Blond Salon', 'Hair Coloring', 'Urban Edge Barbershop', 'Facial Massage'
                        ].map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                                <TouchableOpacity>
                                    <Ionicons name="close" size={14} color="#666" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Nearby Salons */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Nearby Salons</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TireloMap' as never)}>
                            <Text style={styles.viewMapText}>View On Map</Text>
                        </TouchableOpacity>
                    </View>

                    {filteredSalons.map((item, index) => (
                        <View key={index} style={styles.salonCard}>
                            {item.banner_url ? (
                                <Image source={{ uri: item.banner_url }} style={styles.salonImagePlaceholder} />
                            ) : (
                                <View style={styles.salonImagePlaceholder} />
                            )}
                            <View style={styles.salonInfo}>
                                <Text style={styles.salonName}>{item.name}</Text>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={12} color="#FFB800" />
                                    <Text style={styles.locationTextSmall} numberOfLines={1}>{item.address}</Text>
                                </View>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={14} color="#FFB800" />
                                    <Text style={styles.ratingText}>4.8 <Text style={styles.reviewsText}>(120 reviews)</Text></Text>
                                </View>
                            </View>
                            <View style={styles.cardAction}>
                                <Text style={styles.distText}>1.2 km</Text>
                                <TouchableOpacity
                                    style={styles.bookNowBtn}
                                    onPress={() => navigation.navigate('TireloSalonDetails', { salonId: item.id } as never)}
                                >
                                    <Text style={styles.bookNowText}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    {filteredSalons.length === 0 && (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No salons found.</Text>
                    )}
                </ScrollView>
            </View>

            {/* Bottom Tabs */}
            <View style={[styles.bottomTabs, { paddingBottom: insets.bottom > 0 ? insets.bottom : 5, height: 50 + insets.bottom }]}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloHome' as never)}>
                    <Ionicons name="home-outline" size={24} color="#666" />
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="search" size={24} color="#FFB800" />
                    <Text style={[styles.tabText, { color: '#FFB800' }]}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloOffers' as never)}>
                    <Ionicons name="pricetag-outline" size={24} color="#666" />
                    <Text style={styles.tabText}>Offers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('TireloProfile' as never)}>
                    <Ionicons name="person-outline" size={24} color="#666" />
                    <Text style={styles.tabText}>Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 50,
        paddingBottom: 15,
    },
    backButton: {
        marginRight: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#1A1A1A',
    },
    filterBtn: {
        padding: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#EEE',
    },
    scrollContent: {
        paddingHorizontal: 12,
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    clearAllText: {
        fontSize: 12,
        color: '#FFB800',
        fontWeight: '600',
    },
    viewMapText: {
        fontSize: 12,
        color: '#FFB800',
        fontWeight: '600',
    },
    recentRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 10,
    },
    tagText: {
        fontSize: 12,
        color: '#1A1A1A',
    },
    salonCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    salonImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#EEE',
    },
    salonInfo: {
        flex: 1,
        marginLeft: 15,
    },
    salonName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    locationTextSmall: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginLeft: 4,
    },
    reviewsText: {
        fontWeight: 'normal',
        color: '#999',
        fontSize: 12,
    },
    cardAction: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    distText: {
        fontSize: 11,
        color: '#666',
    },
    bookNowBtn: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    bookNowText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    bottomTabs: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
});
