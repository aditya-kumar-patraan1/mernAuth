const mongoose = require("mongoose");

const mySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
   },
    verifyOtp : {
        type : String,
        default : ''
    },
    verifyOtpExpiredAt : {
        type : Number,
        default : 0
    },
    isAccountVerified : {
        type : Boolean,
        default : false
    },
    resetOtpExpiredAt : {
        type : Number,
        default : 0
    }
},{
    timestamps : true
});

const myModel = mongoose.model("user",mySchema);

module.exports = myModel;