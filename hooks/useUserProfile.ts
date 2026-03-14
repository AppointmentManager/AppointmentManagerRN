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
export const useUserProfile = (): UseUserProfileReturn => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await UserService.getUserProfile();

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
        fetchProfile();
    }, []);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile,
    };
};
