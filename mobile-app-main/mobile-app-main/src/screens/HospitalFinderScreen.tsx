import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    ActivityIndicator, Linking, Platform, RefreshControl,
    Modal, ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { HOSPITALS, Hospital } from '../data/hospitals';
import { haversineDistance } from '../utils/distance';
import { getStates, getDistricts, getCities } from '../data/locationData';

type HospitalWithDist = Hospital & { distanceKm: number };

export default function HospitalFinderScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const cancerType: string = route.params?.cancerType || 'Oncology';

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [cityLabel, setCityLabel] = useState<string>('');
    const [sortedHospitals, setSortedHospitals] = useState<HospitalWithDist[]>([]);

    // Manual location picker state
    const [showManualPicker, setShowManualPicker] = useState(false);
    const [pickerStep, setPickerStep] = useState<'state' | 'district' | 'city'>('state');
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const states = getStates();

    // ── GPS location ──────────────────────────────────────────────
    const fetchLocation = useCallback(async () => {
        setLocationError(null);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationError('Location permission denied. Showing all hospitals sorted by name.');
                const fallback = HOSPITALS.map(h => ({ ...h, distanceKm: 9999 }));
                setSortedHospitals(fallback);
                setLoading(false);
                setRefreshing(false);
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const [place] = await Location.reverseGeocodeAsync({
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
            if (place) {
                setCityLabel([place.city, place.region].filter(Boolean).join(', '));
            }

            const withDist: HospitalWithDist[] = HOSPITALS.map(h => ({
                ...h,
                distanceKm: haversineDistance(coords.latitude, coords.longitude, h.latitude, h.longitude),
            })).sort((a, b) => a.distanceKm - b.distanceKm);

            setSortedHospitals(withDist);
        } catch {
            setLocationError('Could not get your location. Showing all hospitals.');
            setSortedHospitals(HOSPITALS.map(h => ({ ...h, distanceKm: 9999 })));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchLocation(); }, [fetchLocation]);

    const onRefresh = () => { setRefreshing(true); fetchLocation(); };

    // ── Manual picker apply ───────────────────────────────────────
    const applyManualLocation = async (cityName: string, districtName: string, stateName: string) => {
        setShowManualPicker(false);
        setLoading(true);
        const query = [cityName, districtName, stateName, 'India'].filter(Boolean).join(', ');
        try {
            const results = await Location.geocodeAsync(query);
            if (results && results.length > 0) {
                const { latitude, longitude } = results[0];
                const withDist: HospitalWithDist[] = HOSPITALS.map(h => ({
                    ...h,
                    distanceKm: haversineDistance(latitude, longitude, h.latitude, h.longitude),
                })).sort((a, b) => a.distanceKm - b.distanceKm);
                setSortedHospitals(withDist);
                setCityLabel([cityName || districtName, stateName].filter(Boolean).join(', '));
                setLocationError(null);
            } else {
                setLocationError(`Could not find location for "${query}". Showing all hospitals.`);
                setSortedHospitals(HOSPITALS.map(h => ({ ...h, distanceKm: 9999 })));
            }
        } catch {
            setLocationError('Failed to locate the selected area. Showing all hospitals.');
            setSortedHospitals(HOSPITALS.map(h => ({ ...h, distanceKm: 9999 })));
        } finally {
            setLoading(false);
        }
    };

    // ── Picker open/reset ─────────────────────────────────────────
    const openPicker = () => {
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedCity('');
        setPickerStep('state');
        setShowManualPicker(true);
    };

    // ── Actions ───────────────────────────────────────────────────
    const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
    const handleDirections = (lat: number, lon: number, name: string) => {
        const label = encodeURIComponent(name);
        const url = Platform.OS === 'ios'
            ? `maps://?ll=${lat},${lon}&q=${label}`
            : `geo:${lat},${lon}?q=${label}`;
        Linking.openURL(url);
    };

    // ── Hospital card ─────────────────────────────────────────────
    const renderHospital = ({ item, index }: { item: HospitalWithDist; index: number }) => {
        const isNear = item.distanceKm < 50;
        const isNearest = index === 0;
        return (
            <View style={[styles.card, isNearest && styles.cardFirst]}>
                {isNearest && (
                    <View style={styles.nearestBadge}>
                        <Text style={styles.nearestBadgeText}>📍 Nearest to You</Text>
                    </View>
                )}
                {item.is_government && (
                    <View style={styles.govBadge}>
                        <Text style={styles.govBadgeText}>🏛 Government</Text>
                    </View>
                )}

                <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconEmoji}>🏥</Text>
                    </View>
                    <View style={styles.cardTitleBlock}>
                        <Text style={styles.hospitalName}>{item.name}</Text>
                        <Text style={styles.hospitalCity}>📍 {item.city}, {item.state}</Text>
                        <Text style={styles.hospitalAddress}>{item.address}</Text>
                    </View>
                    <View style={[styles.ratingPill, { backgroundColor: item.rating >= 4.7 ? '#d1fae5' : '#fef3c7' }]}>
                        <Text style={[styles.ratingText, { color: item.rating >= 4.7 ? '#065f46' : '#92400e' }]}>
                            ⭐ {item.rating}
                        </Text>
                        <Text style={[styles.ratingReviews, { color: item.rating >= 4.7 ? '#065f46' : '#92400e' }]}>
                            {item.total_reviews}+
                        </Text>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <View style={[styles.distBadge, { backgroundColor: isNear ? '#ede9fe' : '#f1f5f9' }]}>
                        <Text style={[styles.distText, { color: isNear ? '#6d28d9' : '#475569' }]}>
                            {item.distanceKm < 9000
                                ? `🗺️  ${item.distanceKm.toFixed(1)} km away`
                                : '📍 Distance unavailable'}
                        </Text>
                    </View>
                    <View style={styles.bedBadge}>
                        <Text style={styles.bedText}>🛏 {item.bed_capacity} beds</Text>
                    </View>
                </View>

                <View style={styles.specialtyWrap}>
                    {item.specialties.slice(0, 4).map((s, i) => (
                        <View key={i} style={styles.specialtyChip}>
                            <Text style={styles.specialtyText}>{s}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(item.phone)} activeOpacity={0.8}>
                        <Text style={styles.callBtnText}>📞  Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dirBtn} onPress={() => handleDirections(item.latitude, item.longitude, item.name)} activeOpacity={0.8}>
                        <Text style={styles.dirBtnText}>🗺️  Directions</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('Appointment', { hospitalId: item.id, hospitalName: item.name })}
                    activeOpacity={0.8}
                >
                    <Text style={styles.bookBtnText}>🗓️  Book Appointment</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // ── Location Picker Modal ─────────────────────────────────────
    const renderPickerModal = () => {
        const districts = selectedState ? getDistricts(selectedState) : [];
        const cities = (selectedState && selectedDistrict) ? getCities(selectedState, selectedDistrict) : [];

        const renderItem = (label: string, onPress: () => void, isSelected: boolean) => (
            <TouchableOpacity
                key={label}
                style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>{label}</Text>
                {isSelected && <Text style={styles.pickerCheckmark}>✓</Text>}
            </TouchableOpacity>
        );

        return (
            <Modal visible={showManualPicker} animationType="slide" transparent onRequestClose={() => setShowManualPicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (pickerStep === 'district') { setPickerStep('state'); setSelectedDistrict(''); }
                                    else if (pickerStep === 'city') { setPickerStep('district'); setSelectedCity(''); }
                                    else setShowManualPicker(false);
                                }}
                                style={styles.modalBackBtn}
                            >
                                <Text style={styles.modalBackText}>
                                    {pickerStep === 'state' ? '✕ Close' : '← Back'}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>
                                {pickerStep === 'state' ? '📍 Select State' :
                                    pickerStep === 'district' ? `📍 ${selectedState} › District` :
                                        `📍 ${selectedDistrict} › City/Town`}
                            </Text>
                        </View>

                        {/* Breadcrumb */}
                        <View style={styles.breadcrumb}>
                            {selectedState ? (
                                <Text style={styles.breadcrumbText}>{selectedState}{selectedDistrict ? ` › ${selectedDistrict}` : ''}{selectedCity ? ` › ${selectedCity}` : ''}</Text>
                            ) : (
                                <Text style={styles.breadcrumbHint}>Select: State → District → City/Town</Text>
                            )}
                        </View>

                        {/* Use GPS button */}
                        <TouchableOpacity
                            style={styles.useGpsBtn}
                            onPress={() => { setShowManualPicker(false); setLoading(true); fetchLocation(); }}
                        >
                            <Text style={styles.useGpsBtnText}>📌 Use My Current GPS Location</Text>
                        </TouchableOpacity>

                        {/* List */}
                        <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                            {pickerStep === 'state' && states.map(s =>
                                renderItem(s, () => {
                                    setSelectedState(s);
                                    setSelectedDistrict('');
                                    setSelectedCity('');
                                    setPickerStep('district');
                                }, selectedState === s)
                            )}

                            {pickerStep === 'district' && (
                                <>
                                    {/* Apply at state level if user wants */}
                                    <TouchableOpacity
                                        style={styles.applyStateBtn}
                                        onPress={() => applyManualLocation('', '', selectedState)}
                                    >
                                        <Text style={styles.applyStateBtnText}>🔍 Show hospitals near entire {selectedState}</Text>
                                    </TouchableOpacity>
                                    {districts.map(d =>
                                        renderItem(d, () => {
                                            setSelectedDistrict(d);
                                            setSelectedCity('');
                                            setPickerStep('city');
                                        }, selectedDistrict === d)
                                    )}
                                </>
                            )}

                            {pickerStep === 'city' && (
                                <>
                                    {/* Apply at district level */}
                                    <TouchableOpacity
                                        style={styles.applyStateBtn}
                                        onPress={() => applyManualLocation('', selectedDistrict, selectedState)}
                                    >
                                        <Text style={styles.applyStateBtnText}>🔍 Show hospitals near {selectedDistrict} district</Text>
                                    </TouchableOpacity>
                                    {cities.map(c =>
                                        renderItem(c, () => {
                                            setSelectedCity(c);
                                            applyManualLocation(c, selectedDistrict, selectedState);
                                        }, selectedCity === c)
                                    )}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    // ── Main render ───────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <View style={styles.headerStrip}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>🏥 Cancer Care Hospitals</Text>
                        <Text style={styles.headerSub}>
                            {cityLabel ? `📍 Near ${cityLabel}` : 'Detecting your location…'}
                        </Text>
                        {cancerType !== 'Oncology' && (
                            <View style={styles.cancerBadge}>
                                <Text style={styles.cancerBadgeText}>🎯 {cancerType} Specialists</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.manualBtn} onPress={openPicker}>
                        <Text style={styles.manualBtnText}>📍 Change{'\n'}Location</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statPill}>
                        <Text style={styles.statPillText}>🏥 {HOSPITALS.length} Hospitals</Text>
                    </View>
                    <View style={styles.statPill}>
                        <Text style={styles.statPillText}>🗺️ Pan-India</Text>
                    </View>
                </View>
            </View>

            {locationError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>⚠️ {locationError}</Text>
                </View>
            )}

            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="#6d28d9" />
                    <Text style={styles.loadingText}>Finding nearby hospitals…</Text>
                </View>
            ) : (
                <FlatList
                    data={sortedHospitals}
                    keyExtractor={item => item.id}
                    renderItem={renderHospital}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6d28d9" />}
                />
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    🔒 Your location is used only to sort nearby hospitals and is never stored.
                </Text>
            </View>

            {renderPickerModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f3ff' },

    headerStrip: {
        backgroundColor: '#4f46e5',
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
    headerSub: { fontSize: 13, color: '#c7d2fe', marginTop: 4 },
    cancerBadge: {
        marginTop: 8, backgroundColor: '#818cf8', borderRadius: 16,
        paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start',
    },
    cancerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    manualBtn: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14,
        alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    },
    manualBtnText: { color: '#fff', fontSize: 12, fontWeight: '700', textAlign: 'center' },

    statsRow: { flexDirection: 'row', gap: 10 },
    statPill: {
        backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 6,
    },
    statPillText: { color: '#e0e7ff', fontSize: 12, fontWeight: '600' },

    errorBanner: {
        backgroundColor: '#fef3c7', padding: 12, marginHorizontal: 16, marginTop: 12,
        borderRadius: 10, borderWidth: 1, borderColor: '#fde68a',
    },
    errorText: { fontSize: 13, color: '#92400e', textAlign: 'center' },

    loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 14, fontSize: 15, color: '#6d28d9' },

    listContent: { padding: 16, gap: 14 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#6d28d9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    cardFirst: { borderWidth: 1.5, borderColor: '#818cf8' },
    nearestBadge: {
        alignSelf: 'flex-start', backgroundColor: '#ede9fe', borderRadius: 12,
        paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
    },
    nearestBadgeText: { fontSize: 12, color: '#6d28d9', fontWeight: '700' },
    govBadge: {
        alignSelf: 'flex-start', backgroundColor: '#dbeafe', borderRadius: 12,
        paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
    },
    govBadgeText: { fontSize: 11, color: '#1e40af', fontWeight: '600' },

    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
    iconCircle: {
        width: 46, height: 46, borderRadius: 14,
        backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
    },
    iconEmoji: { fontSize: 22 },
    cardTitleBlock: { flex: 1 },
    hospitalName: { fontSize: 15, fontWeight: '700', color: '#1e293b', lineHeight: 20 },
    hospitalCity: { fontSize: 12, color: '#4f46e5', marginTop: 2, fontWeight: '600' },
    hospitalAddress: { fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 15 },

    ratingPill: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start', alignItems: 'center' },
    ratingText: { fontSize: 13, fontWeight: '700' },
    ratingReviews: { fontSize: 10, fontWeight: '500', marginTop: 1 },

    metaRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
    distBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
    distText: { fontSize: 13, fontWeight: '600' },
    bedBadge: { backgroundColor: '#f0fdf4', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 5 },
    bedText: { fontSize: 12, color: '#166534', fontWeight: '600' },

    specialtyWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    specialtyChip: {
        backgroundColor: '#f0fdf4', borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 4,
        borderWidth: 1, borderColor: '#bbf7d0',
    },
    specialtyText: { fontSize: 11, color: '#166534', fontWeight: '600' },

    actionRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    callBtn: { flex: 1, backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    callBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    dirBtn: { flex: 1, backgroundColor: '#ede9fe', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    dirBtnText: { color: '#6d28d9', fontSize: 14, fontWeight: '700' },
    bookBtn: { backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    bookBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    footer: { padding: 14, backgroundColor: '#eef2ff', borderTopWidth: 1, borderTopColor: '#c7d2fe' },
    footerText: { fontSize: 12, color: '#4338ca', textAlign: 'center', lineHeight: 17 },

    // ── Modal styles ──────────────────────────────────────────────
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalBox: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: '85%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        gap: 12,
    },
    modalBackBtn: {
        backgroundColor: '#f1f5f9', borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 8,
    },
    modalBackText: { fontSize: 13, color: '#4f46e5', fontWeight: '700' },
    modalTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', flex: 1 },

    breadcrumb: {
        paddingHorizontal: 20, paddingVertical: 10,
        backgroundColor: '#faf5ff',
    },
    breadcrumbText: { fontSize: 13, color: '#6d28d9', fontWeight: '600' },
    breadcrumbHint: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },

    useGpsBtn: {
        marginHorizontal: 20, marginVertical: 10,
        backgroundColor: '#4f46e5', borderRadius: 12,
        paddingVertical: 12, alignItems: 'center',
    },
    useGpsBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    pickerList: { marginHorizontal: 16 },
    pickerItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: '#f8fafc',
        borderRadius: 8,
    },
    pickerItemSelected: { backgroundColor: '#eef2ff' },
    pickerItemText: { flex: 1, fontSize: 15, color: '#334155' },
    pickerItemTextSelected: { color: '#4f46e5', fontWeight: '700' },
    pickerCheckmark: { fontSize: 16, color: '#4f46e5', fontWeight: '800' },

    applyStateBtn: {
        backgroundColor: '#f0fdf4', borderRadius: 12,
        paddingVertical: 14, paddingHorizontal: 16,
        marginVertical: 8,
        borderWidth: 1, borderColor: '#bbf7d0',
    },
    applyStateBtnText: { fontSize: 14, color: '#047857', fontWeight: '700', textAlign: 'center' },
});
