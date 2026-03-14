/**
 * Core type definitions for the AppointmentManager application
 */

/**
 * Represents a user's saved location/address
 */
export interface UserLocation {
    id: string;
    type: 'home' | 'work' | 'other';
    label: string;
    address: string;
    isDefault: boolean;
}

/**
 * Represents a user's profile information
 */
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    initial: string; // First letter of name for avatar
    avatarUrl?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Loading state for async operations
 */
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}
