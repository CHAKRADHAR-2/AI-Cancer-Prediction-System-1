import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert,
    ActivityIndicator, FlatList, RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    collection, addDoc, query, where, orderBy,
    getDocs, updateDoc, doc, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../api/firebase';
import { useAuth } from '../context/AuthContext';

type ApptNav = NativeStackNavigationProp<RootStackParamList, 'Appointment'>;

interface Appointment {
    id: string;
    hospitalId: string;
    hospitalName: string;
    patientName: string;
    phone: string;
    date: string;
    time: string;
    status: 'confirmed' | 'cancelled';
    createdAt: Timestamp;
    userEmail: string;
    userId: string;
}

// ── Email HTML templates ────────────────────────────────────────────────
const confirmationEmailHtml = (
    patientName: string,
    hospitalName: string,
    date: string,
    time: string,
    phone: string,
) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f3ff;border-radius:16px;overflow:hidden;">
  <div style="background:#4f46e5;padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;">🏥 AI Cancer Prediction App</h1>
    <p style="color:#c7d2fe;margin:8px 0 0;">Appointment Confirmation</p>
  </div>
  <div style="padding:32px;background:#fff;">
    <h2 style="color:#10b981;margin-top:0;">✅ Appointment Confirmed!</h2>
    <p style="color:#334155;">Dear <strong>${patientName}</strong>,</p>
    <p style="color:#334155;">Your appointment request has been successfully submitted. Here are your details:</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;font-weight:600;color:#475569;border-radius:8px 0 0 8px;">🏥 Hospital</td>
        <td style="padding:12px 16px;color:#1e293b;font-weight:600;">${hospitalName}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-weight:600;color:#475569;">📅 Date</td>
        <td style="padding:12px 16px;color:#1e293b;">${date}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;font-weight:600;color:#475569;">⏰ Time</td>
        <td style="padding:12px 16px;color:#1e293b;">${time}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-weight:600;color:#475569;">📞 Contact</td>
        <td style="padding:12px 16px;color:#1e293b;">${phone}</td>
      </tr>
    </table>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:20px 0;">
      <p style="color:#92400e;margin:0;font-size:14px;">⚠️ <strong>Note:</strong> This is a request confirmation. The hospital will contact you to finalize your appointment based on doctor availability.</p>
    </div>
    <p style="color:#64748b;font-size:13px;">If you need to cancel or reschedule, please open the AI Cancer Prediction app and manage your appointment from the Appointment screen.</p>
  </div>
  <div style="background:#eef2ff;padding:20px;text-align:center;">
    <p style="color:#6366f1;margin:0;font-size:13px;">© 2025 AI Cancer Prediction System — Your Health, Our Priority</p>
  </div>
</div>
`;

const cancellationEmailHtml = (
    patientName: string,
    hospitalName: string,
    date: string,
    time: string,
) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f3ff;border-radius:16px;overflow:hidden;">
  <div style="background:#4f46e5;padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;">🏥 AI Cancer Prediction App</h1>
    <p style="color:#c7d2fe;margin:8px 0 0;">Appointment Update</p>
  </div>
  <div style="padding:32px;background:#fff;">
    <h2 style="color:#ef4444;margin-top:0;">❌ Appointment Cancelled</h2>
    <p style="color:#334155;">Dear <strong>${patientName}</strong>,</p>
    <p style="color:#334155;">Your appointment has been successfully cancelled. Details of the cancelled appointment:</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;font-weight:600;color:#475569;">🏥 Hospital</td>
        <td style="padding:12px 16px;color:#1e293b;">${hospitalName}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-weight:600;color:#475569;">📅 Date</td>
        <td style="padding:12px 16px;color:#1e293b;">${date}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:12px 16px;font-weight:600;color:#475569;">⏰ Time</td>
        <td style="padding:12px 16px;color:#1e293b;">${time}</td>
      </tr>
    </table>
    <p style="color:#64748b;font-size:13px;">To book a new appointment, open the AI Cancer Prediction app and visit the Hospital Finder section.</p>
  </div>
  <div style="background:#eef2ff;padding:20px;text-align:center;">
    <p style="color:#6366f1;margin:0;font-size:13px;">© 2025 AI Cancer Prediction System — Your Health, Our Priority</p>
  </div>
</div>
`;

// ── Main Component ──────────────────────────────────────────────────────
type Tab = 'book' | 'history';

export default function AppointmentScreen() {
    const navigation = useNavigation<ApptNav>();
    const route = useRoute<any>();
    const hospitalId: string = route.params?.hospitalId || '';
    const hospitalName: string = route.params?.hospitalName || 'Selected Hospital';
    const { user } = useAuth();

    const [tab, setTab] = useState<Tab>('book');

    // Book form state
    const [patientName, setPatientName] = useState(user?.displayName || '');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // History state
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // ── Fetch history ────────────────────────────────────────────────────
    const fetchAppointments = useCallback(async () => {
        if (!user) return;
        setLoadingHistory(true);
        try {
            const q = query(
                collection(db, 'appointments'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc'),
            );
            const snap = await getDocs(q);
            const list: Appointment[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
            setAppointments(list);
        } catch (e) {
            console.error('Failed to fetch appointments:', e);
        } finally {
            setLoadingHistory(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        if (tab === 'history') fetchAppointments();
    }, [tab, fetchAppointments]);

    // ── Book appointment ─────────────────────────────────────────────────
    const handleBooking = async () => {
        if (!patientName.trim() || !phone.trim() || !date.trim() || !time.trim()) {
            Alert.alert('Incomplete', 'Please fill in all appointment details.');
            return;
        }
        if (!user?.email) {
            Alert.alert('Not Logged In', 'Please sign in to book an appointment.');
            return;
        }

        setSubmitting(true);
        try {
            const apptData = {
                hospitalId,
                hospitalName,
                patientName: patientName.trim(),
                phone: phone.trim(),
                date: date.trim(),
                time: time.trim(),
                status: 'confirmed',
                userId: user.uid,
                userEmail: user.email,
                createdAt: serverTimestamp(),
            };

            // Save appointment to Firestore
            await addDoc(collection(db, 'appointments'), apptData);

            // Trigger confirmation email via the `mail` collection
            await addDoc(collection(db, 'mail'), {
                to: user.email,
                message: {
                    subject: `✅ Appointment Confirmed — ${hospitalName}`,
                    html: confirmationEmailHtml(
                        patientName.trim(),
                        hospitalName,
                        date.trim(),
                        time.trim(),
                        phone.trim(),
                    ),
                },
            });

            Alert.alert(
                '🎉 Appointment Confirmed!',
                `Your appointment at ${hospitalName} for ${date} at ${time} has been submitted.\n\nA confirmation email has been sent to ${user.email}`,
                [{ text: 'Great!', onPress: () => { setDate(''); setTime(''); setPhone(''); setTab('history'); } }]
            );
        } catch (e) {
            console.error('Booking error:', e);
            Alert.alert('Error', 'Failed to book appointment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Cancel appointment ───────────────────────────────────────────────
    const handleCancel = (appt: Appointment) => {
        Alert.alert(
            'Cancel Appointment',
            `Are you sure you want to cancel your appointment at ${appt.hospitalName} on ${appt.date}?`,
            [
                { text: 'Keep It', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await updateDoc(doc(db, 'appointments', appt.id), { status: 'cancelled' });

                            // Trigger cancellation email
                            await addDoc(collection(db, 'mail'), {
                                to: appt.userEmail,
                                message: {
                                    subject: `❌ Appointment Cancelled — ${appt.hospitalName}`,
                                    html: cancellationEmailHtml(
                                        appt.patientName,
                                        appt.hospitalName,
                                        appt.date,
                                        appt.time,
                                    ),
                                },
                            });

                            Alert.alert('Cancelled', 'Your appointment has been cancelled and a confirmation email has been sent.');
                            fetchAppointments();
                        } catch (e) {
                            Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    // ── Appointment card ─────────────────────────────────────────────────
    const renderAppointment = ({ item }: { item: Appointment }) => {
        const isConfirmed = item.status === 'confirmed';
        return (
            <View style={[styles.histCard, !isConfirmed && styles.histCardCancelled]}>
                <View style={styles.histCardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: isConfirmed ? '#d1fae5' : '#fee2e2' }]}>
                        <Text style={[styles.statusText, { color: isConfirmed ? '#065f46' : '#991b1b' }]}>
                            {isConfirmed ? '✅ Confirmed' : '❌ Cancelled'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.histHospital}>{item.hospitalName}</Text>
                <View style={styles.histMeta}>
                    <Text style={styles.histMetaText}>👤 {item.patientName}</Text>
                    <Text style={styles.histMetaText}>📅 {item.date}  ⏰ {item.time}</Text>
                    <Text style={styles.histMetaText}>📞 {item.phone}</Text>
                </View>
                {isConfirmed && (
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => handleCancel(item)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // ── Booking Form ─────────────────────────────────────────────────────
    const renderBookingTab = () => (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.headerBlock}>
                <Text style={styles.iconEmoji}>🗓️</Text>
                <Text style={styles.title}>Book Appointment</Text>
                <Text style={styles.subtitle}>{hospitalName}</Text>

                {user?.email && (
                    <View style={styles.emailBadge}>
                        <Text style={styles.emailBadgeText}>📧 Confirmation will be sent to {user.email}</Text>
                    </View>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionLabel}>Patient Details</Text>

                <Text style={styles.label}>Patient Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor="#94a3b8"
                    value={patientName}
                    onChangeText={setPatientName}
                />

                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Preferred Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#94a3b8"
                            value={date}
                            onChangeText={setDate}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Preferred Time</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 10:30 AM"
                            placeholderTextColor="#94a3b8"
                            value={time}
                            onChangeText={setTime}
                        />
                    </View>
                </View>

                <View style={styles.disclaimerBlock}>
                    <Text style={styles.disclaimerText}>
                        ⚠️ This is a request. The hospital will contact you to confirm based on doctor availability.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.primaryBtn, submitting && styles.btnDisabled]}
                    onPress={handleBooking}
                    disabled={submitting}
                    activeOpacity={0.85}
                >
                    {submitting
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.primaryBtnText}>📅  Confirm Appointment Request</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    // ── History Tab ──────────────────────────────────────────────────────
    const renderHistoryTab = () => (
        loadingHistory ? (
            <View style={styles.centerLoad}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text style={styles.loadText}>Loading your appointments…</Text>
            </View>
        ) : appointments.length === 0 ? (
            <View style={styles.emptyWrap}>
                <Text style={styles.emptyEmoji}>📋</Text>
                <Text style={styles.emptyTitle}>No Appointments Yet</Text>
                <Text style={styles.emptyDesc}>Your booked appointments will appear here. Switch to the "Book" tab to schedule one.</Text>
            </View>
        ) : (
            <FlatList
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={renderAppointment}
                contentContainerStyle={styles.histList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); fetchAppointments(); }}
                        tintColor="#4f46e5"
                    />
                }
            />
        )
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Tab Bar */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabBtn, tab === 'book' && styles.tabBtnActive]}
                    onPress={() => setTab('book')}
                >
                    <Text style={[styles.tabBtnText, tab === 'book' && styles.tabBtnTextActive]}>📅 Book</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, tab === 'history' && styles.tabBtnActive]}
                    onPress={() => setTab('history')}
                >
                    <Text style={[styles.tabBtnText, tab === 'history' && styles.tabBtnTextActive]}>
                        📋 My Appointments {appointments.length > 0 ? `(${appointments.length})` : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            {tab === 'book' ? renderBookingTab() : renderHistoryTab()}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f3ff' },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tabBtn: {
        flex: 1, paddingVertical: 10, borderRadius: 12,
        alignItems: 'center', backgroundColor: '#f1f5f9',
    },
    tabBtnActive: { backgroundColor: '#4f46e5' },
    tabBtnText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    tabBtnTextActive: { color: '#fff' },

    scroll: { padding: 20, paddingBottom: 40 },

    headerBlock: { alignItems: 'center', marginVertical: 20 },
    title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginTop: 10, letterSpacing: -0.5 },
    subtitle: { fontSize: 15, color: '#4f46e5', marginTop: 4, fontWeight: '600', textAlign: 'center' },
    iconEmoji: { fontSize: 42 },
    emailBadge: {
        marginTop: 12, backgroundColor: '#eef2ff', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 8,
    },
    emailBadgeText: { fontSize: 12, color: '#4f46e5', fontWeight: '600', textAlign: 'center' },

    card: {
        backgroundColor: '#fff', borderRadius: 20, padding: 22,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
    },
    sectionLabel: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 16 },

    label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 12 },
    input: {
        backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
        borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
        fontSize: 15, color: '#1e293b',
    },
    row: { flexDirection: 'row', gap: 14 },

    disclaimerBlock: {
        backgroundColor: '#fffbeb', padding: 12, borderRadius: 10,
        borderWidth: 1, borderColor: '#fde68a', marginTop: 20, marginBottom: 6,
    },
    disclaimerText: { fontSize: 13, color: '#92400e', lineHeight: 18 },

    primaryBtn: {
        backgroundColor: '#4f46e5', borderRadius: 14, paddingVertical: 18,
        alignItems: 'center', marginTop: 16,
        shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    btnDisabled: { backgroundColor: '#818cf8', shadowOpacity: 0 },
    primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

    // History
    histList: { padding: 16, gap: 14 },
    histCard: {
        backgroundColor: '#fff', borderRadius: 18, padding: 18,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    histCardCancelled: { opacity: 0.7 },
    histCardHeader: { marginBottom: 10 },
    statusBadge: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
    statusText: { fontSize: 12, fontWeight: '700' },
    histHospital: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
    histMeta: { gap: 4 },
    histMetaText: { fontSize: 13, color: '#64748b' },
    cancelBtn: {
        marginTop: 14, backgroundColor: '#fef2f2', borderRadius: 12,
        paddingVertical: 12, alignItems: 'center',
        borderWidth: 1, borderColor: '#fecaca',
    },
    cancelBtnText: { color: '#dc2626', fontSize: 14, fontWeight: '700' },

    centerLoad: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadText: { color: '#6d28d9', fontSize: 15 },
    emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
    emptyEmoji: { fontSize: 56 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
    emptyDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
});
