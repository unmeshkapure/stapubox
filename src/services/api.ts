import axios from 'axios';

const BASE_URL = 'https://stapubox.com/trial';
// Use EXPO_PUBLIC_ prefix for client-side env vars in Expo
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || 'trial_33937015_b1ef28f92e98ba83427054f72155ac89'; // Fallback for dev if env missing, but should be in .env

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Token': API_TOKEN,
  },
});

export interface SendOtpResponse {
  message?: string;
  status?: string;
  // Add other fields as per API response
}

export interface VerifyOtpResponse {
  message?: string;
  token?: string; // Assuming access token is returned
  status?: string;
}

export const sendOtp = async (mobile: string): Promise<SendOtpResponse> => {
  try {
    const response = await apiClient.post('/sendOtp', { mobile });
    return response.data;
  } catch (error) {
    console.error('Send OTP Error:', error);
    throw error;
  }
};

export const verifyOtp = async (mobile: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await apiClient.post(`/verifyOtp?mobile=${mobile}&otp=${otp}`);
    if (response.data.status === 'failed') {
      throw new Error(response.data.message || 'Verification failed');
    }
    return response.data;
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    if (error.response && error.response.status === 400) {
      throw new Error('Wrong OTP Entered');
    }
    throw error;
  }
};

export const resendOtp = async (mobile: string): Promise<SendOtpResponse> => {
  try {
    const response = await apiClient.post(`/resendOtp?mobile=${mobile}`);
    return response.data;
  } catch (error: any) {
    console.error('Send/Resend OTP Error:', error);
    if (error.response && error.response.status === 522) {
      throw new Error('Server timed out. Please check your connection or try again later.');
    }
    throw error;
  }
};
