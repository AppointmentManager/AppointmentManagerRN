import { UserProfile } from './types';

export interface AuthOtpRequest {
    phoneNo?: string;
    emailId?: string;
}

export interface SendOtpPayload extends AuthOtpRequest {
}

export interface VerifyOtpPayload extends AuthOtpRequest {
    otp: string;
    firstName?: string;
    lastName?: string;
}

export interface SendOtpResult {
    message: string;
    expiresIn: number;
    deliveryTarget?: string;
}

export interface AuthSession {
    token: string;
    user: UserProfile;
    isNewUser: boolean;
}
