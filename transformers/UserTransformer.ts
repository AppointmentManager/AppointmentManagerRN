/**
 * UserTransformer - Transforms backend user DTOs to frontend models
 */

import { UserLocation, UserProfile } from '../types/types';
import { UserProfileResponse } from '../repository/UserRepository';

export class UserTransformer {
    /**
     * Maps a backend UserProfileResponse to the app's UserProfile model
     */
    static toUserProfile(response: UserProfileResponse): UserProfile {
        const fullName = `${response.firstName} ${response.lastName}`.trim();
        return {
            id: String(response.userId),
            name: fullName,
            email: response.emailId,
            phone: response.phoneNo,
            initial: response.firstName
                ? response.firstName.charAt(0).toUpperCase()
                : '?',
        };
    }

    /**
     * Maps an array of backend UserProfileResponse to an array of UserProfile models
     */
    static toUserProfileList(responses: UserProfileResponse[]): UserProfile[] {
        return responses.map(UserTransformer.toUserProfile);
    }

    /**
     * Maps a backend UserProfileResponse to the app's UserLocation model
     */
    static toUserLocation(response: UserProfileResponse): UserLocation {
        const { address } = response;
        const typeMap: Record<UserProfileResponse['address']['type'], UserLocation['type']> = {
            HOME: 'home',
            WORK: 'work',
            BUSINESS: 'other',
            OTHER: 'other',
        };
        const label = address.type.charAt(0) + address.type.slice(1).toLowerCase();
        const formattedAddress = [
            address.addressLine1,
            address.addressLine2,
            address.city,
            address.state,
            address.country,
            address.pincode,
        ].filter(Boolean).join(', ');

        return {
            id: String(address.addressId ?? response.userId),
            type: typeMap[address.type],
            label,
            address: formattedAddress,
            isDefault: true,
        };
    }
}
