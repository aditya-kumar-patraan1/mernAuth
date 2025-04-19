const express = require('express');
const { login, register, logout, sendVerifyOTP, verifyEmail, verifyOTPforPasswordReset, CheckverifyOTPforPasswordReset, resetPassword } = require('../Controllers/myControllers');
const myRouter = express.Router();

myRouter.post("/login",login);
myRouter.post("/register",register);
myRouter.post("/logout",logout);
myRouter.post("/sendVerifyOTP",sendVerifyOTP);
myRouter.post("/verifyEmail",verifyEmail);
myRouter.post("/verifyOTPforPasswordReset/:email",verifyOTPforPasswordReset);
myRouter.post("/CheckverifyOTPforPasswordReset",CheckverifyOTPforPasswordReset);
myRouter.put("/resetPassword",resetPassword);

module.exports = myRouter;