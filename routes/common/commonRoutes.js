const express = require("express")
const bcrypt = require('bcryptjs')
const Vonage = require('@vonage/server-sdk')
const User = require("../../models/userModel");
const Seller = require("../../models/sellerModel");

const router = express.Router();

// send otp
router
    .route('/send_otp')
    .post(async (req, res) => {
        const { mobileNo, role } = req.body

        if (!mobileNo || !role) {
            return res
                .json({
                    status: "failed",
                    message: "Mobile number required"
                })
        }

        if (mobileNo.length !== 10) {
            return res
                .json({
                    status: "failed",
                    message: "Enter valid mobile number"
                })
        }

        if (role == 'buyer') {
            await User
                .findOne({ mobileNo: mobileNo })
                .then(async (user) => {
                    if (!user) {
                        return res
                            .json({
                                status: "failed",
                                message: "Account doesn't exist"
                            })
                    }
                })
                .catch(err => console.log(err))
        }
        else {
            await Seller
                .findOne({ mobileNo: mobileNo })
                .then(async (user) => {
                    if (!user) {
                        return res
                            .json({
                                status: "failed",
                                message: "Account doesn't exist"
                            })
                    }
                })
                .catch(err => console.log(err))
        }

        // generate otp
        let otp = (Math.floor(100000 + Math.random() * 900000)).toString()

        // send otp sms on mobile
        const vonage = new Vonage({
            apiKey: "04bb3329",
            apiSecret: "HMg6BJiHslrNHUGi"
        })
        const from = "Agri Shop"
        const to = `91${mobileNo}`
        const text = 'OTP for reset password is' + otp

        vonage.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
                console.log(err)
                return res
                    .json({
                        status: "failed",
                        message: "Sorry OTP could not be sent, Please try again later"
                    })
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    return res
                        .json({
                            status: "success",
                            message: "OTP sent to mobile",
                            otp
                        })
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                    return res
                        .json({
                            status: "failed",
                            message: `Message failed with error: ${responseData.messages[0]['error-text']}`
                        })
                }
            }
        })

    })

// reset user passsword
router
    .route('/reset_password')
    .post(async (req, res) => {
        const { mobileNo, password, role } = req.body

        if (!mobileNo || !password || !role) {
            return res
                .json({
                    status: "failed",
                    message: "All fields are required."
                })
        }

        if (mobileNo.length !== 10) {
            return res
                .json({
                    status: "failed",
                    message: "Enter valid mobile number"
                })
        }

        if (password.length < 8) {
            return res
                .json({
                    status: "failed",
                    message: "Password must contain atleast 8 characters"
                })
        }

        const hashPassword = await bcrypt.hash(password, 12)
        if (role == 'buyer') {
            await User
                .findOneAndUpdate({ mobileNo: mobileNo }, { password: hashPassword })
                .then(async () => {
                    return res
                        .status(201)
                        .json({
                            status: "success",
                            message: "Password successfully updated",
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            await Seller
                .findOneAndUpdate({ mobileNo: mobileNo }, { password: hashPassword })
                .then(async () => {
                    return res
                        .status(201)
                        .json({
                            status: "success",
                            message: "Password successfully updated",
                        })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    })

module.exports = router;