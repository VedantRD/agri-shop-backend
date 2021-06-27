const express = require("express")
const bcrypt = require('bcryptjs')
const fast2sms = require('fast-two-sms')
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

        const from = "Agri Shop"
        const text = 'Agrishop \nOTP for reset password is ' + otp

        var options = {
            authorization: process.env.FAST2SMS_API_KEY,
            message: text,
            numbers: [mobileNo],
            sender_id: from
        }
        const response = await fast2sms.sendMessage(options)
        if (response.return == true) {
            return res
                .json({
                    status: "success",
                    message: "OTP sent to mobile",
                    otp
                })
        }
        else {
            return res
                .json({
                    status: "failed",
                    message: "Sorry OTP could not be sent, Please try again later"
                })
        }


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