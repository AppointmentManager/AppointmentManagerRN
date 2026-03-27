import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
    ActivityIndicator,
    Text,
    useTheme,
} from 'react-native-paper';
import TopBar from '../components/TopBar';
import StoreCard from '../view/StoreCard';
import { StoreService } from '../services/storeService';
import { StoreCardData } from '../types/store';

export default function HomeScreen() {
    const theme = useTheme();
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
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TopBar />
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.colors.background }}
                contentContainerStyle={{ padding: 16 }}
            >
                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#00AA00"
                        style={{ marginTop: 50 }}
                    />
                ) : error ? (
                    <Text
                        variant="bodyLarge"
                        style={{
                            marginTop: 40,
                            color: theme.colors.onSurfaceVariant,
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </Text>
                ) : stores.length === 0 ? (
                    <Text
                        variant="bodyLarge"
                        style={{
                            marginTop: 40,
                            color: theme.colors.onSurfaceVariant,
                            textAlign: 'center',
                        }}
                    >
                        No stores available yet.
                    </Text>
                ) : (
                    stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))
                )}
            </ScrollView>
        </View>
    );
}
