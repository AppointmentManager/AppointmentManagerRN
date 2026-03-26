import { apiClient } from '../utils/apiClient';
import { UserProfileResponse } from './UserRepository';

export interface SendOtpRequest {
    phoneNo?: string;
    emailId?: string;
}

export interface SendOtpResponse {
    message: string;
    expiresIn: number;
    deliveryTarget?: string;
}

export interface VerifyOtpRequest extends SendOtpRequest {
    otp: string;
    firstName?: string;
    lastName?: string;
}

export interface VerifyOtpResponse {
    token: string;
    user: UserProfileResponse;
    isNewUser: boolean;
}

export class AuthRepository {
    static async sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
        return apiClient.post<SendOtpResponse>('/auth/send-otp', request);
    }

    static async resendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
        return apiClient.post<SendOtpResponse>('/auth/resend-otp', request);
    }

    static async verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
        return apiClient.post<VerifyOtpResponse>('/auth/verify-otp', request);
    }
}
