import { VerifyOtpResponse } from '../repository/AuthRepository';
import { AuthSession } from '../types/auth';
import { UserTransformer } from './UserTransformer';

export class AuthTransformer {
    static toAuthSession(response: VerifyOtpResponse): AuthSession {
        return {
            token: response.token,
            user: UserTransformer.toUserProfile(response.user),
            isNewUser: response.isNewUser,
        };
    }
}
