const axios = require('axios');

const BASE_URL = 'https://stapubox.com/trial';
const API_TOKEN = 'trial_33937015_b1ef28f92e98ba83427054f72155ac89';

async function testVerify() {
    try {
        const mobile = '1234567890';
        const otp = '0000'; // Invalid OTP
        console.log(`Testing verifyOtp with mobile=${mobile} and otp=${otp}`);
        
        const response = await axios.post(`${BASE_URL}/verifyOtp?mobile=${mobile}&otp=${otp}`, {}, {
            headers: {
                'X-Api-Token': API_TOKEN
            }
        });
        
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testVerify();
