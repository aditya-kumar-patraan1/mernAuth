import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {  
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("registeredEmail");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in both fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const myData = {
      email,
      password
    }

    axios.put("http://localhost:8000/api/auth/resetPassword",myData).then(()=>{
      console.log("Data sent to backend");
    }).catch((e)=>{
      console.log("Data not sent to Backend");
    });
    
    setPassword('');
    setConfirmPassword('');

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Reset Your Password
        </h2>

        <form onSubmit={handleReset} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-600">
                <FiLock className="text-lg" />
              </div>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-600">
                <FiLock className="text-lg" />
              </div>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:cursor-pointer font-semibold hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default ResetPassword;
