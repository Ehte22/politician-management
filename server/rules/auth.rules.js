exports.registerRules = {
    firstName: { required: true },
    lastName: { required: true },
    email: { required: true, email: true },
    phone: {
        required: true, pattern: /^[6-9]\d{9}$/
    },
    password: { required: true, min: 8, max: 16 },
    role: { required: true },
    profile: { required: false },
}

exports.sendOTPRules = {
    username: { required: true, email: true },
}

exports.verifyOTPRules = {
    username: { required: true, email: true },
    otp: { required: true }
}

exports.signInRules = {
    email: { required: true, email: true },
    password: { required: true }
}

exports.forgotPasswordRules = {
    email: { required: true, email: true },
}

exports.resetPasswordRules = {
    password: { required: true, min: 8, max: 16 },
    confirmPassword: { required: true },
}