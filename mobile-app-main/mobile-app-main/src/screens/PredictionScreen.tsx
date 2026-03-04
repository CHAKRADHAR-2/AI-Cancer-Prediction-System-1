import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { predictCancerRisk } from '../api/client';
import { PatientData } from '../types/healthcare';

type PredNav = NativeStackNavigationProp<RootStackParamList, 'Prediction'>;

type PickerOption = { label: string; value: string };

function SimplePicker({ label, options, value, onChange }: { label: string; options: PickerOption[]; value: string; onChange: (v: string) => void }) {
    return (
        <View style={styles.pickerWrap}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pickerRow}>
                {options.map(o => (
                    <TouchableOpacity key={o.value} style={[styles.pickerChip, value === o.value && styles.pickerChipActive]} onPress={() => onChange(o.value)}>
                        <Text style={[styles.pickerChipText, value === o.value && styles.pickerChipTextActive]}>{o.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export default function PredictionScreen() {
    const navigation = useNavigation<PredNav>();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        age: '45', gender: 'female', bmi: '25',
        bloodPressureSystolic: '120', bloodPressureDiastolic: '80',
        cholesterol: '200', glucose: '90', hemoglobin: '14',
        whiteBloodCells: '7000', platelets: '250000',
        smokingHistory: 'never' as 'never' | 'former' | 'current',
        familyHistory: false,
        alcoholConsumption: 'never' as 'never' | 'occasional' | 'moderate' | 'heavy',
        exerciseFrequency: 'moderate' as 'none' | 'light' | 'moderate' | 'heavy',
        dietType: 'mixed' as 'vegetarian' | 'non-vegetarian' | 'vegan' | 'mixed',
        stressLevel: 'moderate' as 'low' | 'moderate' | 'high',
        sleepHours: '7',
        sunExposure: 'moderate' as 'minimal' | 'moderate' | 'high',
        immuneSystemStatus: 'normal' as 'normal' | 'compromised' | 'enhanced',
        // Symptoms
        unexplainedWeightLoss: false, persistentFatigue: false, unusualBleeding: false,
        persistentCough: false, skinChanges: false, digestiveIssues: false,
        // Cancer-specific
        tumorSize: '', lymphNodes: '', metastasis: false,
        previousCancerHistory: false, radiationExposure: false, chemotherapyHistory: false,
        // Medical
        chronicConditions: '', currentMedications: '', symptoms: '',
    });

    const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (!form.age || !form.bmi) {
            Alert.alert('Validation', 'Please fill in Age and BMI at minimum.');
            return;
        }
        setLoading(true);
        try {
            const patientData: PatientData = {
                age: parseInt(form.age), gender: form.gender as any, bmi: parseFloat(form.bmi),
                smokingHistory: form.smokingHistory, familyHistory: form.familyHistory,
                bloodPressure: { systolic: parseInt(form.bloodPressureSystolic), diastolic: parseInt(form.bloodPressureDiastolic) },
                cholesterol: parseInt(form.cholesterol), glucose: parseInt(form.glucose),
                hemoglobin: parseFloat(form.hemoglobin), whiteBloodCells: parseInt(form.whiteBloodCells),
                platelets: parseInt(form.platelets),
                alcoholConsumption: form.alcoholConsumption, exerciseFrequency: form.exerciseFrequency,
                dietType: form.dietType, stressLevel: form.stressLevel, sleepHours: parseInt(form.sleepHours),
                sunExposure: form.sunExposure, immuneSystemStatus: form.immuneSystemStatus,
                unexplainedWeightLoss: form.unexplainedWeightLoss, persistentFatigue: form.persistentFatigue,
                unusualBleeding: form.unusualBleeding, persistentCough: form.persistentCough,
                skinChanges: form.skinChanges, digestiveIssues: form.digestiveIssues,
                tumorSize: form.tumorSize ? parseFloat(form.tumorSize) : undefined,
                lymphNodes: form.lymphNodes ? parseInt(form.lymphNodes) : undefined,
                metastasis: form.metastasis, previousCancerHistory: form.previousCancerHistory,
                radiationExposure: form.radiationExposure, chemotherapyHistory: form.chemotherapyHistory,
                chronicConditions: form.chronicConditions || undefined, currentMedications: form.currentMedications || undefined,
                symptoms: form.symptoms || undefined,
            };
            const result = await predictCancerRisk(patientData);
            navigation.navigate('Results', { predictionResult: result });
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to generate prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Enhanced Cancer Risk Assessment</Text>
                    <Text style={styles.heroSub}>Comprehensive health evaluation with detailed cancer risk factors analysis</Text>
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.row}>
                        <View style={styles.col}><Text style={styles.label}>Age *</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.age} onChangeText={v => updateForm('age', v)} /></View>
                        <View style={styles.col}><Text style={styles.label}>BMI *</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={form.bmi} onChangeText={v => updateForm('bmi', v)} /></View>
                    </View>
                    <SimplePicker label="Gender *" options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]} value={form.gender} onChange={v => updateForm('gender', v)} />
                    <SimplePicker label="Smoking History *" options={[{ label: 'Never', value: 'never' }, { label: 'Former', value: 'former' }, { label: 'Current', value: 'current' }]} value={form.smokingHistory} onChange={v => updateForm('smokingHistory', v)} />
                    <View style={styles.switchRow}><Text style={styles.switchLabel}>Family History of Cancer</Text><Switch value={form.familyHistory} onValueChange={v => updateForm('familyHistory', v)} /></View>
                </View>

                {/* Risk Factors */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detailed Risk Factors</Text>
                    <SimplePicker label="Alcohol Consumption" options={[{ label: 'Never', value: 'never' }, { label: 'Occasional', value: 'occasional' }, { label: 'Moderate', value: 'moderate' }, { label: 'Heavy', value: 'heavy' }]} value={form.alcoholConsumption} onChange={v => updateForm('alcoholConsumption', v)} />
                    <SimplePicker label="Exercise Frequency" options={[{ label: 'None', value: 'none' }, { label: 'Light', value: 'light' }, { label: 'Moderate', value: 'moderate' }, { label: 'Heavy', value: 'heavy' }]} value={form.exerciseFrequency} onChange={v => updateForm('exerciseFrequency', v)} />
                    <SimplePicker label="Diet Type" options={[{ label: 'Vegetarian', value: 'vegetarian' }, { label: 'Non-Veg', value: 'non-vegetarian' }, { label: 'Vegan', value: 'vegan' }, { label: 'Mixed', value: 'mixed' }]} value={form.dietType} onChange={v => updateForm('dietType', v)} />
                    <SimplePicker label="Stress Level" options={[{ label: 'Low', value: 'low' }, { label: 'Moderate', value: 'moderate' }, { label: 'High', value: 'high' }]} value={form.stressLevel} onChange={v => updateForm('stressLevel', v)} />
                    <SimplePicker label="Sun Exposure" options={[{ label: 'Minimal', value: 'minimal' }, { label: 'Moderate', value: 'moderate' }, { label: 'High', value: 'high' }]} value={form.sunExposure} onChange={v => updateForm('sunExposure', v)} />
                    <View style={styles.row}>
                        <View style={styles.col}><Text style={styles.label}>Sleep Hours</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.sleepHours} onChangeText={v => updateForm('sleepHours', v)} /></View>
                    </View>
                </View>

                {/* Vitals & Blood Work */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Blood Work & Vitals</Text>
                    <View style={styles.row}>
                        <View style={styles.col}><Text style={styles.label}>Systolic BP</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.bloodPressureSystolic} onChangeText={v => updateForm('bloodPressureSystolic', v)} /></View>
                        <View style={styles.col}><Text style={styles.label}>Diastolic BP</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.bloodPressureDiastolic} onChangeText={v => updateForm('bloodPressureDiastolic', v)} /></View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}><Text style={styles.label}>Cholesterol</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.cholesterol} onChangeText={v => updateForm('cholesterol', v)} /></View>
                        <View style={styles.col}><Text style={styles.label}>Glucose</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.glucose} onChangeText={v => updateForm('glucose', v)} /></View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}><Text style={styles.label}>Hemoglobin</Text><TextInput style={styles.input} keyboardType="decimal-pad" value={form.hemoglobin} onChangeText={v => updateForm('hemoglobin', v)} /></View>
                        <View style={styles.col}><Text style={styles.label}>WBC Count</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.whiteBloodCells} onChangeText={v => updateForm('whiteBloodCells', v)} /></View>
                    </View>
                    <Text style={styles.label}>Platelets</Text>
                    <TextInput style={styles.input} keyboardType="number-pad" value={form.platelets} onChangeText={v => updateForm('platelets', v)} />
                </View>

                {/* Symptoms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Current Symptoms</Text>
                    {[
                        { key: 'unexplainedWeightLoss', label: 'Unexplained Weight Loss', desc: 'Significant weight loss without trying' },
                        { key: 'persistentFatigue', label: 'Persistent Fatigue', desc: 'Extreme tiredness not relieved by rest' },
                        { key: 'unusualBleeding', label: 'Unusual Bleeding', desc: 'Bleeding or bruising without known cause' },
                        { key: 'persistentCough', label: 'Persistent Cough', desc: 'Cough lasting more than a few weeks' },
                        { key: 'skinChanges', label: 'Skin Changes', desc: 'New moles or changes in existing moles' },
                        { key: 'digestiveIssues', label: 'Digestive Issues', desc: 'Changes in bowel habits or abdominal pain' },
                    ].map(s => (
                        <View key={s.key} style={styles.symptomRow}>
                            <View style={styles.symptomInfo}>
                                <Text style={styles.symptomLabel}>{s.label}</Text>
                                <Text style={styles.symptomDesc}>{s.desc}</Text>
                            </View>
                            <Switch value={(form as any)[s.key]} onValueChange={v => updateForm(s.key, v)} />
                        </View>
                    ))}
                </View>

                {/* Cancer-Specific */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cancer-Specific (If Applicable)</Text>
                    <View style={styles.row}>
                        <View style={styles.col}><Text style={styles.label}>Tumor Size (cm)</Text><TextInput style={styles.input} keyboardType="decimal-pad" placeholder="Optional" value={form.tumorSize} onChangeText={v => updateForm('tumorSize', v)} /></View>
                        <View style={styles.col}><Text style={styles.label}>Lymph Nodes</Text><TextInput style={styles.input} keyboardType="number-pad" placeholder="Optional" value={form.lymphNodes} onChangeText={v => updateForm('lymphNodes', v)} /></View>
                    </View>
                    <View style={styles.switchRow}><Text style={styles.switchLabel}>Metastasis</Text><Switch value={form.metastasis} onValueChange={v => updateForm('metastasis', v)} /></View>
                    <View style={styles.switchRow}><Text style={styles.switchLabel}>Previous Cancer History</Text><Switch value={form.previousCancerHistory} onValueChange={v => updateForm('previousCancerHistory', v)} /></View>
                    <View style={styles.switchRow}><Text style={styles.switchLabel}>Radiation Exposure</Text><Switch value={form.radiationExposure} onValueChange={v => updateForm('radiationExposure', v)} /></View>
                </View>

                {/* Medical History */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical History</Text>
                    <Text style={styles.label}>Chronic Conditions</Text>
                    <TextInput style={[styles.input, styles.textArea]} multiline placeholder="e.g. diabetes, hypertension..." value={form.chronicConditions} onChangeText={v => updateForm('chronicConditions', v)} />
                    <Text style={styles.label}>Current Medications</Text>
                    <TextInput style={[styles.input, styles.textArea]} multiline placeholder="List current medications..." value={form.currentMedications} onChangeText={v => updateForm('currentMedications', v)} />
                    <Text style={styles.label}>Current Symptoms</Text>
                    <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Describe any symptoms..." value={form.symptoms} onChangeText={v => updateForm('symptoms', v)} />
                </View>

                {/* Submit */}
                <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>🔬  Generate AI Prediction</Text>}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 20, backgroundColor: '#f0f4ff' },
    heroSection: { alignItems: 'center', marginBottom: 24 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },
    heroSub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 6 },
    section: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#4f46e5', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eef2ff', paddingBottom: 8 },
    label: { fontSize: 13, fontWeight: '500', color: '#475569', marginBottom: 4, marginTop: 4 },
    input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 15, color: '#0f172a', marginBottom: 8 },
    textArea: { minHeight: 70, textAlignVertical: 'top' },
    row: { flexDirection: 'row', gap: 12 },
    col: { flex: 1 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    switchLabel: { fontSize: 15, color: '#334155', flex: 1 },
    symptomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
    symptomInfo: { flex: 1, marginRight: 12 },
    symptomLabel: { fontSize: 15, fontWeight: '500', color: '#1e293b' },
    symptomDesc: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    pickerWrap: { marginBottom: 12 },
    pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pickerChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
    pickerChipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
    pickerChipText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
    pickerChipTextActive: { color: '#fff' },
    submitBtn: { backgroundColor: '#4f46e5', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 8 },
    submitBtnDisabled: { opacity: 0.6 },
    submitBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
