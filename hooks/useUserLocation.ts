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
export const useUserLocation = (userId: number): UseUserLocationReturn => {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocation = async () => {
        if (!userId) {
            setLocation(null);
            setError('Missing user ID');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await UserService.getUserLocation(userId);

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
        let isMounted = true;

        const loadLocation = async () => {
            if (!userId) {
                setLocation(null);
                setError('Missing user ID');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await UserService.getUserLocation(userId);

                if (!isMounted) {
                    return;
                }

                if (response.success && response.data) {
                    setLocation(response.data);
                } else {
                    setError(response.error || 'Failed to fetch location');
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadLocation();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    return {
        location,
        isLoading,
        error,
        refetch: fetchLocation,
    };
};
