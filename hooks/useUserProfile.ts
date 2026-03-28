/**
 * Custom hook for managing user profile data
 */

import { useState, useEffect } from 'react';
import { UserProfile } from '../types/types';
import { UserService } from '../services/userService';

interface UseUserProfileReturn {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user's profile data
 * Automatically fetches on mount
 * @returns Object containing profile data, loading state, error, and refetch function
 */
export const useUserProfile = (userId: number): UseUserProfileReturn => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        if (!userId) {
            setProfile(null);
            setError('Missing user ID');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await UserService.getUserProfile(userId);

            if (response.success && response.data) {
                setProfile(response.data);
            } else {
                setError(response.error || 'Failed to fetch profile');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            if (!userId) {
                setProfile(null);
                setError('Missing user ID');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await UserService.getUserProfile(userId);

                if (!isMounted) {
                    return;
                }

                if (response.success && response.data) {
                    setProfile(response.data);
                } else {
                    setError(response.error || 'Failed to fetch profile');
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

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile,
    };
};
