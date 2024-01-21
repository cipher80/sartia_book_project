const speakeasy = require('speakeasy');

const otpService = {
  generateOTP: () => {
    return speakeasy.totp({
      secret: speakeasy.generateSecret().base32,
      digits: 6,
    });
  },

  verifyOTP: (otp, secret) => {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      window: 1, 
    });
  },
};

module.exports = otpService;
