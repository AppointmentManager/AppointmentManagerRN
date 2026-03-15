import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import TopBar from '../components/TopBar';
import StoreCard from '../view/StoreCard';
import { StoreService } from '../services/storeService';
import { StoreCardData } from '../types/store';

export default function HomeScreen() {
    const [stores, setStores] = useState<StoreCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        setLoading(true);
        const response = await StoreService.getStoreCatalog();

        if (response.success && response.data) {
            setStores(response.data);
            setError(null);
        } else {
            setStores([]);
            setError(response.error || 'Unable to load stores right now.');
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TopBar />
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#00AA00" style={styles.loader} />
                ) : error ? (
                    <Text style={styles.message}>{error}</Text>
                ) : stores.length === 0 ? (
                    <Text style={styles.message}>No stores available yet.</Text>
                ) : (
                    stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    content: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    scrollContent: {
        padding: 16,
    },
    loader: {
        marginTop: 50,
    },
    message: {
        marginTop: 40,
        color: '#CCCCCC',
        textAlign: 'center',
        fontSize: 16,
    },
});
