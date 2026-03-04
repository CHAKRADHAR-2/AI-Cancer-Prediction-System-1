import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Animated
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { PredictionResult } from '../types/healthcare';

type Tab = 'analysis' | 'recommendations' | 'prognosis';

export default function ResultsScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const result: PredictionResult | undefined = route.params?.predictionResult;
    const [activeTab, setActiveTab] = useState<Tab>('analysis');

    if (!result) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorEmoji}>😕</Text>
                <Text style={styles.errorText}>No prediction data available.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Prediction')}>
                    <Text style={styles.backBtnText}>← Back to Assessment</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { prediction, featureImportance, recommendations, medications, nutritionRecommendations, prognosis } = result;
    const cancerDetected = prediction.cancerType !== 'No Cancer Detected';
    const RISK_COLOR = prediction.riskLevel === 'High' ? '#ef4444' : prediction.riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
    const HERO_BG = cancerDetected ? '#fef2f2' : '#ecfdf5';
    const HERO_ACCENT = cancerDetected ? '#b91c1c' : '#047857';

    const tabs: { key: Tab; label: string; emoji: string }[] = [
        { key: 'analysis', label: 'Analysis', emoji: '📊' },
        { key: 'recommendations', label: 'Recs', emoji: '💡' },
        { key: 'prognosis', label: 'Prognosis', emoji: '📋' },
    ];

    const confidenceWidth = `${prediction.confidence}%` as any;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ── Hero ── */}
            <View style={[styles.hero, { backgroundColor: HERO_BG }]}>
                <Text style={styles.heroEmoji}>{cancerDetected ? '⚠️' : '✅'}</Text>
                <Text style={[styles.heroTitle, { color: HERO_ACCENT }]}>
                    {cancerDetected ? 'Cancer Indicators Detected' : 'No Cancer Detected!'}
                </Text>
                <Text style={styles.heroSub}>
                    {cancerDetected
                        ? 'Consult an oncologist immediately for further evaluation.'
                        : 'Your health indicators look good. Maintain your healthy lifestyle.'}
                </Text>
            </View>

            {/* ── Prediction Summary ── */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>CANCER TYPE</Text>
                        <Text style={styles.summaryValue} numberOfLines={2}>{prediction.cancerType}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>RISK LEVEL</Text>
                        <View style={[styles.riskPill, { backgroundColor: RISK_COLOR + '20' }]}>
                            <Text style={[styles.riskPillText, { color: RISK_COLOR }]}>{prediction.riskLevel}</Text>
                        </View>
                    </View>
                    {cancerDetected && prediction.stage ? (
                        <>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>STAGE</Text>
                                <Text style={styles.summaryValue}>Stage {prediction.stage}</Text>
                            </View>
                        </>
                    ) : null}
                </View>

                {/* Confidence bar */}
                <View style={styles.confBlock}>
                    <View style={styles.confLabelRow}>
                        <Text style={styles.confLabel}>AI Confidence</Text>
                        <Text style={styles.confPct}>{prediction.confidence}%</Text>
                    </View>
                    <View style={styles.confTrack}>
                        <View style={[styles.confFill, { width: confidenceWidth, backgroundColor: RISK_COLOR }]} />
                    </View>
                </View>
            </View>

            {/* ── Tabs ── */}
            <View style={styles.tabBar}>
                {tabs.map(t => (
                    <TouchableOpacity
                        key={t.key}
                        style={[styles.tab, activeTab === t.key && styles.tabActive]}
                        onPress={() => setActiveTab(t.key)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.tabEmoji}>{t.emoji}</Text>
                        <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ── Tab: Analysis ── */}
            {activeTab === 'analysis' && (
                <View style={styles.tabContent}>
                    {/* Feature Importance */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📊 Feature Importance</Text>
                        {featureImportance.map((f, i) => (
                            <View key={i} style={styles.featureItem}>
                                <Text style={styles.featureName}>{f.feature}</Text>
                                <View style={styles.barTrack}>
                                    <View style={[
                                        styles.barFill,
                                        { width: `${Math.round(f.importance * 100)}%`, backgroundColor: f.impact === 'negative' ? '#ef4444' : '#10b981' }
                                    ]} />
                                </View>
                                <Text style={[styles.featurePct, { color: f.impact === 'negative' ? '#ef4444' : '#10b981' }]}>
                                    {Math.round(f.importance * 100)}%
                                </Text>
                            </View>
                        ))}
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} /><Text style={styles.legendText}>Risk Factor</Text></View>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#10b981' }]} /><Text style={styles.legendText}>Protective</Text></View>
                        </View>
                    </View>

                    {/* Medications */}
                    {cancerDetected && medications.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>💊 Medication Recommendations</Text>
                            {medications.map((m, i) => (
                                <View key={i} style={styles.medCard}>
                                    <View style={styles.medHeader}>
                                        <Text style={styles.medName}>{m.name}</Text>
                                        <View style={styles.medCategoryPill}>
                                            <Text style={styles.medCategoryText}>{m.category}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.medDetail}>💉 {m.dosage}  •  🔄 {m.frequency}</Text>
                                    <Text style={styles.medDetail}>⏱️ Duration: {m.duration}</Text>
                                    <Text style={styles.medSideEffects}>⚠️ {m.sideEffects.join(' · ')}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}

            {/* ── Tab: Recommendations ── */}
            {activeTab === 'recommendations' && (
                <View style={styles.tabContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🩺 Health Recommendations</Text>
                        {recommendations.map((r, i) => (
                            <View key={i} style={styles.recItem}>
                                <View style={styles.recBullet}><Text style={styles.recBulletText}>{i + 1}</Text></View>
                                <Text style={styles.recText}>{r}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🥗 Nutrition Recommendations</Text>
                        {nutritionRecommendations.map((n, i) => (
                            <View key={i} style={styles.nutritionCard}>
                                <Text style={styles.nutritionCat}>{n.category}</Text>
                                <View style={styles.nutritionFoodsRow}>
                                    {n.foods.map((f, j) => (
                                        <View key={j} style={styles.foodChip}><Text style={styles.foodChipText}>{f}</Text></View>
                                    ))}
                                </View>
                                <Text style={styles.nutritionBenefit}>✨ {n.benefits}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* ── Tab: Prognosis ── */}
            {activeTab === 'prognosis' && (
                <View style={styles.tabContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Prognosis Summary</Text>
                        <View style={[styles.progHero, { backgroundColor: prognosis.isInDanger ? '#fef2f2' : '#ecfdf5' }]}>
                            <Text style={[styles.progOutlook, { color: prognosis.isInDanger ? '#b91c1c' : '#047857' }]}>
                                {prognosis.isInDanger ? '⚠️' : '✅'} {prognosis.outlook} Outlook
                            </Text>
                            <Text style={styles.progRate}>Survival Rate: <Text style={{ fontWeight: '800' }}>{prognosis.survivalRate}</Text></Text>
                            <Text style={styles.progTimeframe}>{prognosis.timeframe}</Text>
                        </View>
                        <View style={{ marginTop: 16 }}>
                            <Text style={styles.progRemTitle}>Recommended Treatment Paths</Text>
                            {prognosis.remedies.map((r, i) => (
                                <View key={i} style={styles.progRemedyRow}>
                                    <Text style={styles.progRemedyBullet}>→</Text>
                                    <Text style={styles.progRemedyText}>{r}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* ── Actions ── */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionPrimary}
                    onPress={() => navigation.navigate('HospitalFinder', { cancerType: prediction.cancerType })}
                    activeOpacity={0.85}
                >
                    <Text style={styles.actionPrimaryText}>🏥  Find Nearby Hospitals</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionSecondary}
                    onPress={() => navigation.navigate('Prediction')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.actionSecondaryText}>🔬  New Assessment</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>⚠️ For educational and screening purposes only. Always consult a qualified healthcare professional.</Text>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f3ff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    errorEmoji: { fontSize: 48, marginBottom: 16 },
    errorText: { fontSize: 16, color: '#64748b', marginBottom: 24 },
    backBtn: { backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
    backBtnText: { color: '#fff', fontWeight: '700' },

    hero: {
        paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    },
    heroEmoji: { fontSize: 52, marginBottom: 12 },
    heroTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
    heroSub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 20 },

    summaryCard: {
        backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16,
        borderRadius: 20, padding: 20,
        shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    summaryItem: { alignItems: 'center', flex: 1 },
    summaryDivider: { width: 1, backgroundColor: '#f1f5f9' },
    summaryLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.8, marginBottom: 6 },
    summaryValue: { fontSize: 15, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
    riskPill: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
    riskPillText: { fontSize: 14, fontWeight: '800' },

    confBlock: {},
    confLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    confLabel: { fontSize: 13, color: '#64748b', fontWeight: '500' },
    confPct: { fontSize: 13, color: '#4f46e5', fontWeight: '700' },
    confTrack: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4 },
    confFill: { height: 8, borderRadius: 4 },

    tabBar: {
        flexDirection: 'row', marginHorizontal: 16, marginTop: 14,
        backgroundColor: '#fff', borderRadius: 14, padding: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    tab: {
        flex: 1, alignItems: 'center', paddingVertical: 10,
        borderRadius: 10, flexDirection: 'row', justifyContent: 'center', gap: 5,
    },
    tabActive: { backgroundColor: '#4f46e5' },
    tabEmoji: { fontSize: 14 },
    tabLabel: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
    tabLabelActive: { color: '#fff' },

    tabContent: {},

    section: {
        backgroundColor: '#fff', marginHorizontal: 16, marginTop: 14,
        borderRadius: 20, padding: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 16 },

    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
    featureName: { width: 90, fontSize: 13, color: '#475569', fontWeight: '500' },
    barTrack: { flex: 1, height: 8, backgroundColor: '#f1f5f9', borderRadius: 4 },
    barFill: { height: 8, borderRadius: 4 },
    featurePct: { width: 36, fontSize: 12, fontWeight: '700', textAlign: 'right' },
    legendRow: { flexDirection: 'row', gap: 20, marginTop: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: '#64748b' },

    medCard: {
        backgroundColor: '#f8fafc', borderRadius: 14, padding: 14,
        marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#4f46e5',
    },
    medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    medName: { fontSize: 15, fontWeight: '800', color: '#1e293b' },
    medCategoryPill: { backgroundColor: '#eef2ff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
    medCategoryText: { fontSize: 11, color: '#4f46e5', fontWeight: '600' },
    medDetail: { fontSize: 13, color: '#64748b', marginTop: 3 },
    medSideEffects: { fontSize: 12, color: '#f59e0b', marginTop: 6, fontStyle: 'italic' },

    recItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
    recBullet: {
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center',
    },
    recBulletText: { fontSize: 12, fontWeight: '800', color: '#4f46e5' },
    recText: { flex: 1, fontSize: 14, color: '#475569', lineHeight: 20 },

    nutritionCard: { backgroundColor: '#f0fdf4', borderRadius: 14, padding: 14, marginBottom: 12 },
    nutritionCat: { fontSize: 15, fontWeight: '700', color: '#047857', marginBottom: 8 },
    nutritionFoodsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
    foodChip: { backgroundColor: '#dcfce7', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    foodChipText: { fontSize: 12, color: '#166534', fontWeight: '600' },
    nutritionBenefit: { fontSize: 12, color: '#64748b', fontStyle: 'italic' },

    progHero: { borderRadius: 16, padding: 20, alignItems: 'center' },
    progOutlook: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    progRate: { fontSize: 15, color: '#334155', marginBottom: 4 },
    progTimeframe: { fontSize: 13, color: '#64748b' },
    progRemTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
    progRemedyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    progRemedyBullet: { fontSize: 16, color: '#4f46e5', fontWeight: '800' },
    progRemedyText: { fontSize: 14, color: '#475569', flex: 1 },

    actions: { marginHorizontal: 16, marginTop: 20, gap: 12 },
    actionPrimary: {
        backgroundColor: '#4f46e5', borderRadius: 16,
        paddingVertical: 18, alignItems: 'center',
        shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
    },
    actionPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    actionSecondary: {
        backgroundColor: '#fff', borderRadius: 16,
        paddingVertical: 18, alignItems: 'center',
        borderWidth: 1.5, borderColor: '#e2e8f0',
    },
    actionSecondaryText: { color: '#475569', fontSize: 16, fontWeight: '700' },

    disclaimer: {
        marginHorizontal: 16, marginTop: 20,
        backgroundColor: '#fffbeb', borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: '#fde68a',
    },
    disclaimerText: { fontSize: 12, color: '#92400e', textAlign: 'center', lineHeight: 17 },
});
