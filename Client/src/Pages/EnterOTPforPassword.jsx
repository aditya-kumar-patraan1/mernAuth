import axios from "axios";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiKey } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const EnterOTPforPassword = () => {
  const location = useLocation();

  const email =
    location.state?.email || localStorage.getItem("registeredEmail");

  console.log(`Email is : ${email}`);

  const Navigate = useNavigate();
  const [otp, setOtp] = useState("");

  function sentToBackend() {
    axios
      .post(`http://localhost:8000/api/auth/verifyOTPforPasswordReset/${email}`)
      .then(() => {
        console.log(`Email sent to Backend to send OTP for reset Password`);
        toast.success("Email submitted. Please check your inbox.");
        localStorage.setItem("registeredEmail", email);
        Navigate("/EnterOTPforPassword");
      })
      .catch((e) => {
        console.log(
          `Email does sent to Backend to send OTP for reset Password`
        );
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    const myData = {
      email: email,
      otp: otp,
    };

    axios
      .post(
        "http://localhost:8000/api/auth/CheckverifyOTPforPasswordReset",
        myData
      )
      .then((res) => {
        console.log(`Sent to Backend`);
        console.log(res.data);
        if (res.data.status === 1) {
          Navigate("/ResetPassword");
        } else {
          setOtp("");
          Navigate("/EnterOTPforPassword");
        }
      })
      .catch((e) => {
        console.log(`Not Sent to Backend : ${e.message}`);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Enter OTP
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="otp"
            >
              One-Time Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-600">
                <FiKey className="text-lg" />
              </div>
              <input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
          >
            Submit OTP
          </button>
          <Toaster />
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm hover:cursor-pointer flex justify-center items-center w-full"
            onClick={sentToBackend}
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterOTPforPassword;
