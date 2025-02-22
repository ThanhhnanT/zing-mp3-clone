import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 300
        }
    },
    {
        timestamps: true
    }
)

const OTP = mongoose.model("OTP", OTPSchema, "otp")

export default OTP