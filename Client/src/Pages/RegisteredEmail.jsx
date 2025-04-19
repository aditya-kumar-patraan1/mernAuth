import axios from "axios";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RegisteredEmail = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  
  function sentToBackend() {
    axios
      .post(`http://localhost:8000/api/auth/verifyOTPforPasswordReset/${email}`)
      .then(() => {
        console.log(`Email sent to Backend to send OTP for reset Password`);
        toast.success("Email submitted. Please check your inbox.");
        localStorage.setItem("registeredEmail",email);
        Navigate("/EnterOTPforPassword");
      })
      .catch((e) => {
        console.log(
          `Email does sent to Backend to send OTP for reset Password`
        );
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || email == "") {
      toast.error("Please enter your registered email");
      return;
    }

    sentToBackend();
  };

  return (
    <>
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-xl border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
            Enter Registered Email
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Please enter the email you used during registration.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input with Icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                <FiMail className="text-xl" />
              </div>
              <input
                type="email"
                placeholder="Registered Email Address"
                className="pl-12 pr-4 py-3 w-full border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold py-3 rounded-lg transition"
            >
              Submit Email
            </button>
          </form>

          <Toaster position="top-right" />
        </div>
      </div>
    </>
  );
};

export default RegisteredEmail;
