import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const Navigate = useNavigate();

  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/auth/login", formData)
      .then((res) => {
        console.log(`Data sent to Backend...`);
        setFormdata({
          email: "",
          password: "",
        });
        console.log(res.data);
        if (res.data.status === 0) {
          Navigate("/RegisterPage");
        } else {
          toast.success("Login Successfully...");
          Navigate("/");
        }
      })
      .catch((e) => {
        console.log(`Data not sent to Backend...`);
      });
  }

  function handleChange(e) {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    console.log("Form Data Updated: ", formData);
  }, [formData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Login to Your Account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <FiMail className="text-lg" />
              </div>
              <input
                id="email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <FiLock className="text-lg" />
              </div>
              <input
                id="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
            >
              Login
            </button>
            <Toaster />
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm hover:cursor-pointer"
              onClick={() => Navigate("/RegisteredEmail")}
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Register link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/registerPage"
              className="text-blue-600 hover:underline font-medium"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
