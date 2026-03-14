/**
 * Custom hook for managing user location data
 */

import { useState, useEffect } from 'react';
import { UserLocation } from '../types/types';
import { UserService } from '../services/userService';

interface UseUserLocationReturn {
    location: UserLocation | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user's location data
 * Automatically fetches on mount
 * @returns Object containing location data, loading state, error, and refetch function
 */
export const useUserLocation = (): UseUserLocationReturn => {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocation = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await UserService.getUserLocation();

            if (response.success && response.data) {
                setLocation(response.data);
            } else {
                setError(response.error || 'Failed to fetch location');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return {
        location,
        isLoading,
        error,
        refetch: fetchLocation,
    };
};
