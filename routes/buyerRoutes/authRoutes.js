const express = require("express")
const validator = require("validator")
const bcrypt = require('bcryptjs')

const User = require("../../models/userModel");
const Cart = require("../../models/cartModel");

const router = express.Router();

// user signup route and its handeler
router
    .route('/signup')
    .post(async (req, res) => {
        const { mobileNo, name, password } = req.body

        if (!name || !mobileNo || !password) {
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

        await User
            .findOne({ mobileNo: mobileNo })
            .then(async (user) => {
                if (user) {
                    return res
                        .json({
                            status: "failed",
                            message: "Account with that mobile number already exists"
                        })
                } else {
                    const hashPassword = await bcrypt.hash(password, 12)
                    await User
                        .create({
                            mobileNo: parseInt(mobileNo),
                            name: name,
                            password: hashPassword
                        })
                        .then((user) => {

                            Cart.create({ 'ownedBy': user._id })
                                .then(() => console.log('Cart created for user'))
                                .catch((err) => console.log(err))

                            user.password = undefined

                            return res
                                .status(201)
                                .json({
                                    status: "success",
                                    message: "User created succesfully!",
                                    user
                                })
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                }
            })
            .catch((err) => {
                console.log(err)
            })

    })

// user signin route and its handeler
router
    .route('/signin')
    .post(async (req, res) => {
        const { mobileNo, password } = req.body

        if (!mobileNo || !password) {
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

        await User
            .findOne({ mobileNo: mobileNo })
            .then((user) => {
                if (!user) {
                    return res
                        .json({
                            status: "failed",
                            message: "Invalid mobile number or password"
                        })
                } else {
                    bcrypt
                        .compare(password, user.password)
                        .then((match) => {
                            if (match) {
                                user.password = undefined
                                return res
                                    .json({
                                        status: "success",
                                        message: "Login successful",
                                        user
                                    })
                            } else {
                                return res
                                    .json({
                                        status: "failed",
                                        message: "Invalid mobile number or Password."
                                    })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }

            })
            .catch((err) => {
                console.log(err)
            })

    })

module.exports = router;