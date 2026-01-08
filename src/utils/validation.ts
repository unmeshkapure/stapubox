export const isValidIndianMobileNumber = (mobile: string): boolean => {
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(mobile);
};

export const isValidOtp = (otp: string): boolean => {
    const otpRegex = /^\d{4}$/;
    return otpRegex.test(otp);
};
