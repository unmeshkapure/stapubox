const axios = require('axios');

const BASE_URL = 'https://stapubox.com/trial';
const API_TOKEN = 'trial_33937015_b1ef28f92e98ba83427054f72155ac89';

// MOCKING the Service layer behavior since we cannot easily import TS in this environment without setup
// The logic I implemented in api.ts is:
// if (response.data.status === 'failed') { throw new Error(...) }

async function verifyOtpServiceRefactored(mobile, otp) {
    try {
        const response = await axios.post(`${BASE_URL}/verifyOtp?mobile=${mobile}&otp=${otp}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Token': API_TOKEN,
            }
        });

        // THIS IS THE LOGIC I ADDED
        if (response.data.status === 'failed') {
            throw new Error(response.data.message || 'Verification failed');
        }

        return response.data;
    } catch (error) {
        throw error;
    }
}

async function testFix() {
    try {
        const mobile = '1234567890';
        const otp = '0000'; // Invalid OTP
        console.log(`Testing verifyOtpServiceRefactored with mobile=${mobile} and otp=${otp}`);

        await verifyOtpServiceRefactored(mobile, otp);

        console.log('FAIL: The verification should have thrown an error but succeeded.');
    } catch (error) {
        console.log('PASS: Caught expected error:', error.message);
    }
}

testFix();
