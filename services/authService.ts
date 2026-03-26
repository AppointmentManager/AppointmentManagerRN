import { AuthRepository } from '../repository/AuthRepository';
import { AuthTransformer } from '../transformers/AuthTransformer';
import { AuthSession, SendOtpPayload, SendOtpResult, VerifyOtpPayload } from '../types/auth';
import { ApiResponse } from '../types/types';
import { apiClient } from '../utils/apiClient';

export class AuthService {
    static async sendOtp(payload: SendOtpPayload): Promise<ApiResponse<SendOtpResult>> {
        try {
            const response = await AuthRepository.sendOtp(payload);
            return {
                success: true,
                data: response,
                message: response.message,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send OTP',
            };
        }
    }

    static async resendOtp(payload: SendOtpPayload): Promise<ApiResponse<SendOtpResult>> {
        try {
            const response = await AuthRepository.resendOtp(payload);
            return {
                success: true,
                data: response,
                message: response.message,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to resend OTP',
            };
        }
    }

    static async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<AuthSession>> {
        try {
            const response = await AuthRepository.verifyOtp(payload);
            const session = AuthTransformer.toAuthSession(response);
            apiClient.setAuthToken(session.token);
            return {
                success: true,
                data: session,
                message: 'Authentication successful',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to verify OTP',
            };
        }
    }

    static signOut() {
        apiClient.clearAuthToken();
    }
}
