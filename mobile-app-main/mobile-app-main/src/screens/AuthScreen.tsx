import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../api/firebase';

export default function AuthScreen() {
    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot password state
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const getFirebaseErrorMessage = (code: string): string => {
        switch (code) {
            case 'auth/invalid-email': return 'Please enter a valid email address.';
            case 'auth/user-not-found': return 'No account found with this email. Please sign up.';
            case 'auth/wrong-password': return 'Incorrect password. Please try again.';
            case 'auth/invalid-credential': return 'Incorrect email or password. Please try again.';
            case 'auth/email-already-in-use': return 'An account with this email already exists. Please sign in.';
            case 'auth/weak-password': return 'Password must be at least 6 characters.';
            case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed': return 'Network error. Please check your connection.';
            default: return 'Something went wrong. Please try again.';
        }
    };

    const handleForgotPassword = async () => {
        if (!resetEmail.trim()) {
            Alert.alert('Enter Email', 'Please enter your email address to receive a reset link.');
            return;
        }
        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail.trim());
            Alert.alert(
                '📧 Reset Link Sent!',
                `A password reset link has been sent to ${resetEmail.trim()}. Please check your inbox (and spam folder).`,
                [{ text: 'OK', onPress: () => { setShowForgot(false); setResetEmail(''); } }]
            );
        } catch (e: any) {
            Alert.alert('Error', getFirebaseErrorMessage(e.code));
        } finally {
            setResetLoading(false);
        }
    };

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Missing Fields', 'Please enter your email and password.');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            // Navigation is handled automatically by AppNavigator's onAuthStateChanged
        } catch (e: any) {
            Alert.alert('Sign In Failed', getFirebaseErrorMessage(e.code));
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!firstName.trim() || !email.trim() || !password) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
            // Set display name on the Firebase user profile
            await updateProfile(user, {
                displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
            });
            // Navigation is handled automatically by AppNavigator's onAuthStateChanged
        } catch (e: any) {
            Alert.alert('Sign Up Failed', getFirebaseErrorMessage(e.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🧬</Text>
                    </View>
                    <Text style={styles.headerTitle}>AI Cancer Prediction</Text>
                    <Text style={styles.headerSub}>
                        {tab === 'signin'
                            ? 'Welcome back! Sign in to continue.'
                            : 'Create your account to get started.'}
                    </Text>
                </View>

                <View style={styles.card}>
                    {/* Tab switcher */}
                    <View style={styles.tabRow}>
                        <TouchableOpacity
                            style={[styles.tab, tab === 'signin' && styles.tabActive]}
                            onPress={() => setTab('signin')}
                        >
                            <Text style={[styles.tabText, tab === 'signin' && styles.tabTextActive]}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, tab === 'signup' && styles.tabActive]}
                            onPress={() => setTab('signup')}
                        >
                            <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {tab === 'signin' ? (
                        <View style={styles.form}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#94a3b8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            {/* Forgot Password */}
                            <TouchableOpacity
                                onPress={() => { setShowForgot(!showForgot); setResetEmail(email); }}
                                style={styles.forgotLink}
                            >
                                <Text style={styles.forgotLinkText}>🔑 Forgot Password?</Text>
                            </TouchableOpacity>

                            {showForgot && (
                                <View style={styles.forgotBox}>
                                    <Text style={styles.forgotBoxTitle}>Reset your password</Text>
                                    <Text style={styles.forgotBoxSub}>Enter your email and we'll send you a reset link.</Text>
                                    <TextInput
                                        style={[styles.input, { marginTop: 10 }]}
                                        placeholder="Your email address"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={resetEmail}
                                        onChangeText={setResetEmail}
                                    />
                                    <TouchableOpacity
                                        style={[styles.resetBtn, resetLoading && styles.btnDisabled]}
                                        onPress={handleForgotPassword}
                                        disabled={resetLoading}
                                        activeOpacity={0.85}
                                    >
                                        {resetLoading
                                            ? <ActivityIndicator color="#fff" size="small" />
                                            : <Text style={styles.resetBtnText}>📧 Send Reset Link</Text>}
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                                onPress={handleSignIn}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.primaryBtnText}>Sign In →</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setTab('signup')} style={styles.switchLink}>
                                <Text style={styles.switchLinkText}>Don't have an account? <Text style={styles.switchLinkBold}>Sign Up</Text></Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.form}>
                            <View style={styles.row}>
                                <View style={styles.halfCol}>
                                    <Text style={styles.label}>First Name *</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First name"
                                        placeholderTextColor="#94a3b8"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={styles.halfCol}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Last name"
                                        placeholderTextColor="#94a3b8"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>
                            <Text style={styles.label}>Email Address *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#94a3b8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Text style={styles.label}>Password * (min. 6 characters)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                                onPress={handleSignUp}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.primaryBtnText}>Create Account →</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setTab('signin')} style={styles.switchLink}>
                                <Text style={styles.switchLinkText}>Already have an account? <Text style={styles.switchLinkBold}>Sign In</Text></Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Text style={styles.footerNote}>
                    🔒 Your data is secured with Firebase Authentication.{'\n'}We never store your password.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eef2ff' },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },

    header: { alignItems: 'center', marginBottom: 28 },
    logoCircle: {
        width: 72, height: 72, borderRadius: 24,
        backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
    },
    logoEmoji: { fontSize: 36 },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 },
    headerSub: { fontSize: 14, color: '#64748b', marginTop: 6, textAlign: 'center', lineHeight: 20 },

    card: {
        backgroundColor: '#fff', borderRadius: 24, padding: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 20, elevation: 5,
    },

    tabRow: {
        flexDirection: 'row', marginBottom: 24,
        backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4,
    },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    tabActive: {
        backgroundColor: '#fff',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
    },
    tabText: { fontSize: 15, fontWeight: '500', color: '#94a3b8' },
    tabTextActive: { color: '#4f46e5', fontWeight: '700' },

    form: { gap: 4 },
    label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 8 },
    input: {
        backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0',
        borderRadius: 12, padding: 14, fontSize: 15, color: '#0f172a', marginBottom: 4,
    },
    row: { flexDirection: 'row', gap: 12 },
    halfCol: { flex: 1 },

    primaryBtn: {
        backgroundColor: '#4f46e5', borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginTop: 16,
        shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    },
    btnDisabled: { opacity: 0.65, shadowOpacity: 0 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

    switchLink: { alignItems: 'center', marginTop: 16 },
    switchLinkText: { fontSize: 14, color: '#64748b' },
    switchLinkBold: { color: '#4f46e5', fontWeight: '700' },

    forgotLink: { alignSelf: 'flex-end', marginTop: 6, marginBottom: 4 },
    forgotLinkText: { fontSize: 13, color: '#4f46e5', fontWeight: '600' },

    forgotBox: {
        backgroundColor: '#f0f9ff', borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: '#bae6fd', marginVertical: 8,
    },
    forgotBoxTitle: { fontSize: 15, fontWeight: '700', color: '#0369a1', marginBottom: 4 },
    forgotBoxSub: { fontSize: 13, color: '#0284c7', lineHeight: 18 },
    resetBtn: {
        backgroundColor: '#0284c7', borderRadius: 12,
        paddingVertical: 14, alignItems: 'center', marginTop: 12,
    },
    resetBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    footerNote: {
        textAlign: 'center', fontSize: 12, color: '#94a3b8',
        marginTop: 28, lineHeight: 18,
    },
});
