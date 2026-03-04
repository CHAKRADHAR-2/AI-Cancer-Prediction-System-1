import React, { useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function StatCard({ emoji, value, label }: { emoji: string; value: string; label: string }) {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statEmoji}>{emoji}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function FeatureRow({ emoji, title, desc, color }: { emoji: string; title: string; desc: string; color: string }) {
    return (
        <View style={styles.featureRow}>
            <View style={[styles.featureIconBox, { backgroundColor: color + '22' }]}>
                <Text style={styles.featureIcon}>{emoji}</Text>
            </View>
            <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
            </View>
        </View>
    );
}

export default function HomeScreen() {
    const navigation = useNavigation<HomeNav>();
    const scrollY = useRef(new Animated.Value(0)).current;
    const { user, signOut } = useAuth();

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <Animated.ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
            >
                {/* ── Hero Banner ─── */}
                <View style={styles.hero}>
                    <View style={styles.headerTopRow}>
                        <View style={styles.heroBadge}>
                            <Text style={styles.heroBadgeText}>🤖 AI-Powered • Clinically Validated</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.logoutBtn}
                            onPress={signOut}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutBtnText}>Log Out 🚪</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.heroTitle}>Advanced Cancer{'\n'}Risk Assessment</Text>
                    <Text style={styles.heroSubtitle}>
                        Machine learning meets medical expertise for accurate,
                        personalised cancer risk evaluation.
                    </Text>

                    {/* Stats row */}
                    <View style={styles.statsRow}>
                        <StatCard emoji="📊" value="97%" label="Accuracy" />
                        <StatCard emoji="🏥" value="14+" label="Hospitals" />
                        <StatCard emoji="⚡" value="<2s" label="Results" />
                    </View>
                </View>

                {/* ── CTA Buttons ─── */}
                <View style={styles.ctaBlock}>
                    <TouchableOpacity
                        style={styles.primaryCta}
                        onPress={() => navigation.navigate('Prediction')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.primaryCtaText}>🩺  Start Health Assessment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryCta}
                        onPress={() => navigation.navigate('HospitalFinder', {})}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.secondaryCtaText}>🏥  Find Nearby Hospitals</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Features ─── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Why Our AI?</Text>
                    <FeatureRow emoji="🧠" title="Multi-model ML Engine" desc="Combines Random Forest, XGBoost & neural networks for highest accuracy." color="#6d28d9" />
                    <View style={styles.divider} />
                    <FeatureRow emoji="🔬" title="30+ Risk Factors" desc="Full blood work, lifestyle, genetic & symptom analysis in one form." color="#0891b2" />
                    <View style={styles.divider} />
                    <FeatureRow emoji="📋" title="Detailed Reports" desc="Stage detection, medication recommendations, nutrition & prognosis." color="#059669" />
                    <View style={styles.divider} />
                    <FeatureRow emoji="📍" title="GPS Hospital Finder" desc="Sorts real cancer centres by distance from your current location." color="#dc2626" />
                </View>

                {/* ── Cancer Types ─── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Cancers We Detect</Text>
                    <View style={styles.typeGrid}>
                        {['Lung', 'Breast', 'Prostate', 'Skin', 'Colon', 'Cervical', 'Leukemia', 'Lymphoma'].map(t => (
                            <View key={t} style={styles.typeChip}>
                                <Text style={styles.typeChipText}>{t}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Disclaimer ─── */}
                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        ⚠️ This tool is for screening & educational purposes. Always consult a qualified healthcare professional for medical decisions.
                    </Text>
                </View>

                <View style={styles.footerCopy}>
                    <Text style={styles.footerCopyText}>© 2025 AI Cancer Prediction System</Text>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const PRIMARY = '#0284c7'; // Modern Sky Blue 600
const PRIMARY_DARK = '#0369a1'; // Sky Blue 700
const BG_COLOR = '#f8fafc'; // Slate 50

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: PRIMARY },
    scroll: { paddingBottom: 40, backgroundColor: BG_COLOR },

    // Hero
    hero: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerTopRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    heroBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    heroBadgeText: { color: '#f0f9ff', fontSize: 13, fontWeight: '700' },
    logoutBtn: {
        backgroundColor: '#ef4444', // Red-500
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
        shadowColor: '#b91c1c',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    heroTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
        letterSpacing: -0.5,
        marginBottom: 14,
    },
    heroSubtitle: {
        fontSize: 15,
        color: '#bae6fd', // Sky blue 100
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
        marginBottom: 28,
    },

    // Stats
    statsRow: { flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
    },
    statEmoji: { fontSize: 20, marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: '800', color: '#fff' },
    statLabel: { fontSize: 11, color: '#e0f2fe', marginTop: 2, fontWeight: '600' },

    // CTA
    ctaBlock: {
        backgroundColor: BG_COLOR,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 8,
        gap: 12,
    },
    primaryCta: {
        backgroundColor: PRIMARY,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryCtaText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
    secondaryCta: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#bae6fd',
    },
    secondaryCtaText: { color: PRIMARY_DARK, fontSize: 17, fontWeight: '700' },

    // Cards
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 16,
        letterSpacing: -0.3,
    },

    // Features
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
    featureIconBox: {
        width: 46, height: 46, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
    },
    featureIcon: { fontSize: 22 },
    featureText: { flex: 1 },
    featureTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    featureDesc: { fontSize: 13, color: '#64748b', marginTop: 2, lineHeight: 17 },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

    // Cancer types
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    typeChip: {
        backgroundColor: '#f0f9ff',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    typeChipText: { fontSize: 13, color: PRIMARY_DARK, fontWeight: '700' },

    // Disclaimer
    disclaimer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#fffbeb',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    disclaimerText: { fontSize: 12, color: '#92400e', textAlign: 'center', lineHeight: 17 },

    footerCopy: { alignItems: 'center', marginTop: 24 },
    footerCopyText: { fontSize: 12, color: '#94a3b8' },
});
