import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import PredictionScreen from '../screens/PredictionScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HospitalFinderScreen from '../screens/HospitalFinderScreen';
import AuthScreen from '../screens/AuthScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import { PredictionResult } from '../types/healthcare';

export type RootStackParamList = {
    Auth: undefined;
    Home: undefined;
    Prediction: undefined;
    Results: { predictionResult: PredictionResult };
    HospitalFinder: { cancerType?: string };
    Appointment: { hospitalId: string; hospitalName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { user, loading } = useAuth();

    // Show a loading spinner while Firebase checks persisted auth state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTintColor: '#0f172a',
                    headerTitleStyle: { fontWeight: '600' },
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: '#f0f4ff' },
                }}
            >
                {user ? (
                    // ── Authenticated stack ────────────────────────────────────
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Prediction" component={PredictionScreen} options={{ title: 'Health Assessment' }} />
                        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'AI Results' }} />
                        <Stack.Screen name="HospitalFinder" component={HospitalFinderScreen} options={{ title: 'Find Hospitals' }} />
                        <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Book Appointment' }} />
                    </>
                ) : (
                    // ── Unauthenticated stack ──────────────────────────────────
                    <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef2ff',
    },
});
