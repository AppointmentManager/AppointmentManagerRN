/**
 * UserTransformer - Transforms backend user DTOs to frontend models
 */

import { UserProfile } from '../types/types';
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
}
