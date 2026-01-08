import { isValidIndianMobileNumber, isValidOtp } from '../validation';

describe('Validation Utils', () => {
    it('should validate correct Indian mobile numbers', () => {
        expect(isValidIndianMobileNumber('9876543210')).toBe(true);
        expect(isValidIndianMobileNumber('6123456789')).toBe(true);
    });

    it('should invalidate incorrect mobile numbers', () => {
        expect(isValidIndianMobileNumber('1234567890')).toBe(false); // Starts with 1
        expect(isValidIndianMobileNumber('987654321')).toBe(false); // Too short
        expect(isValidIndianMobileNumber('98765432100')).toBe(false); // Too long
        expect(isValidIndianMobileNumber('abcdefghij')).toBe(false); // Non-numeric
    });

    it('should validate correct OTP', () => {
        expect(isValidOtp('1234')).toBe(true);
        expect(isValidOtp('0000')).toBe(true);
    });

    it('should invalidate incorrect OTP', () => {
        expect(isValidOtp('123')).toBe(false);
        expect(isValidOtp('12345')).toBe(false);
        expect(isValidOtp('abcd')).toBe(false);
    });
});
