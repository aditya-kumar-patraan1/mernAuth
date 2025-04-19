const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const myModel = require("../Models/Schema");
const transporter = require("../Config/nodemailer");

require("dotenv").config();

const register = async (req, res) => {
  // console.log(`registered activated..`);
  const { name, email, password } = req.body;

  // console.log(`Name is : ${name}`);
  // console.log(`Email is : ${email}`);
  // console.log(`Password is : ${password}`);

  if (!name || !email || !password) {
    return res.status(400).send({
      status: 0,
      message: "information is not complete",
    });
  }

  try {
    const existingUser = await myModel.findOne({ email });
    if (existingUser) {
      return res.send({
        status: 0,
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const myInfo = new myModel({ name, email, password: hashedPassword });
    await myInfo.save();

    const token = jwt.sign({ id: myInfo._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //sending welcome MAIL message to anshu

    const mailDetails = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Aditya's Demo Functionality",
      text: `${name} has been login to out Testing Website with : ${email}`,
    };

    await transporter.sendMail(mailDetails);

    return res.send({
      status: 1,
      message: "User registered successfully",
      user: {
        id: myInfo._id,
        name: myInfo.name,
        email: myInfo.email,
      },
    });
  } catch (e) {
    return res.status(400).send({
      status: 0,
      "error-message": e.message,
    });
  }
};

const login = async (req, res) => {
  console.log(`Login functionality working....`);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      status: 0,
      message: "please give complete details",
    });
  }

  try {
    const myInfo = await myModel.findOne({ email });

    if (!myInfo) {
      return res.send({
        status: 0,
        message: "user not found",
        myData: null,
      });
    }

    const isMatch = await bcrypt.compare(password, myInfo.password);

    const token = jwt.sign({ id: myInfo._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (!isMatch) {
      return res.send({
        status: 0,
        message: "password is incorrect",
        myData: null,
      });
    }

    return res.send({
      status: 1,
      message: "user found and logged-in",
      myData: myInfo,
    });
  } catch (e) {
    return res.send({
      status: -1,
      "error-message": e.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).send({
      status: 1,
      message: "User logged out successfully",
    });
  } catch (e) {
    return res.status(500).send({
      status: 0,
      "error-message": e.message,
    });
  }
};

//send verification Code to email for recovery Password purpose
const sendVerifyOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const myInfo = await myModel.findOne({ email });

    if (!myInfo) {
      return res.status(404).send({
        status: 0,
        message: "User not found",
      });
    }

    if (myInfo.isAccountVerified) {
      return res.status(200).send({
        status: 1,
        message: "User already verified !",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    console.log(`OTP is : ${otp}`);

    myInfo.verifyOtp = otp;
    myInfo.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await myInfo.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Account Verification OTP`,
      text: `Your OTP is ${otp}.Get your Account Verified with the above OTP mentioned.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      status: 1,
      message: "Verification code send to email successfully...",
      data: myInfo,
    });
  } catch (e) {
    return res.status(400).send({
      status: 0,
      "error-message": e.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  console.log(`email given is : ${email}`);
  console.log(`OTP give is : ${otp}`);

  if (!email || !otp) {
    return res.status(400).send({
      status: 0,
      message: "Please complete the details are incomplete...",
    });
  }

  try {
    const myInfo = await myModel.findOne({ email });

    if (!myInfo) {
      return res.status(400).send({
        status: 0,
        message: "User not found...",
      });
    }

    if (myInfo.verifyOtp === "" || myInfo.verifyOtp !== otp) {
      return res.status(400).send({
        status: 0,
        message: "OTP is incorrect or not mentioned...",
      });
    }

    if (myInfo.verifyOtpExpiredAt < Date.now()) {
      return res.status(400).send({
        status: 0,
        message: "OTP get expired resend the OTP again",
      });
    }

    myInfo.isAccountVerified = true;
    myInfo.verifyOtp = "";
    myInfo.verifyOtpExpiredAt = 0;

    await myInfo.save();

    return res.status(200).send({
      status: 1,
      message: "Email Verified Succesfully..",
    });
  } catch (e) {
    return res.status(400).send({
      status: 0,
      message: "Email not verified due to Server errors !",
    });
  }
};

//resetting Purpose OTP sending

const verifyOTPforPasswordReset = async (req, res) => {
  try {
    // console.log("Ho raha hai  kaaam he he !");
    const email = req.params.email;

    console.log(`Registered Email is : ${email}`);

    if (!email) {
      return res.send({
        status: 0,
        message: "Please Provide Complete Details",
      });
    }

    const myInfo = await myModel.findOne({ email });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    console.log(`OTP is : ${otp}`);

    myInfo.verifyOtp = otp;
    myInfo.resetOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await myInfo.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `OTP for reset New Password`,
      text: `OTP is ${otp} for reset password copy paste it on our website and then set a new Password`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      status: 1,
      message: "OTP code send to email successfully for password reset...",
      data: myInfo,
    });

  } catch (e) {
    return res.send({
      status: 0,
      "error-message": e.message,
    });
  }
};

const CheckverifyOTPforPasswordReset = async (req,res) => {
  console.log("activated booom");
  const {email,otp} = req.body;

  console.log(`Email is : ${email}`);
  console.log(`Entered OTP is : ${otp}`);

  if(!email || !otp){
    return res.send({
      status: 0,
      message: "Please complete the details are incomplete...",
    });
  }

  try{
    
    const myInfo = await myModel.findOne({email});

    if(!myInfo){
      return res.send({
        status: 0,
        message: "User not found...",
      });
    }

    if(myInfo.verifyOtp!=otp){
      return res.send({
        status: 0,
        message: "OTP is incorrect...",
      });
    }

    if(myInfo.resetOtpExpiredAt < Date.now()){
      return res.send({
        status: 0,
        message: "OTP get expired resend the OTP again",
      });
    }

    myInfo.verifyOtp = "";
    myInfo.resetOtpExpiredAt = 0;

    await myInfo.save();

    return res.send({
      status : 1,
      "message" : "OTP matched !"
    });

  }catch(e){
    return res.send({
      status : 0,
      "error-message" : e.message
    });
  }

};

const resetPassword =  async (req,res) => {
  // console.log("Reset Password Activated");
  const {email,password} = req.body;

  // console.log(email+" ---> "+password);

  if(!email || !password){
    return res.send({
      status : 0,
      "message":"Incomplete information provided !"
    });
  }

  try{
    const DataToBeUpdated = await myModel.findOne({email});

    if(!DataToBeUpdated){
      return res.send({
        status : 0,
        "message":`User not found`
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    DataToBeUpdated.password=hashedPassword;

    await DataToBeUpdated.save();

    return res.send({
      status : 1,
      "message":"New Password reset"
    });

  }catch(e){
    return res.send({
      status : 0,
      "error-message":`Password not reset due to Server Error ${e.message}`
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  sendVerifyOTP,
  verifyEmail,
  verifyOTPforPasswordReset,
  CheckverifyOTPforPasswordReset,
  resetPassword
};