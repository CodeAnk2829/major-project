import {
  Alert,
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "COMPLAINER", // Default role
      });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill in all fields");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("http://localhost:3000/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // credentials: "include",
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);

      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      setLoading(false);
      if (res.ok) {
        navigate('/');
      }

    } catch (error: any) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-[rgb(222,224,244)] flex-col items-center justify-center p-8">
        <img
          src="/manit_logo.png"
          alt="NIT Bhopal Logo"
          className="w-1/3 mb-4"
        />
        <h1 className="text-2xl font-bold text-center text-[rgba(35,75,138,1)]">
          MAULANA AZAD
        </h1>
        <h2 className="text-xl font-bold text-center text-[rgba(35,75,138,1)]">
          NATIONAL INSTITUTE OF TECHNOLOGY
        </h2>
        <h3 className="text-lg font-bold text-center text-[rgba(35,75,138,1)]">
          BHOPAL
        </h3>
      </div>

      <div className="flex w-full md:w-1/2 lg:w-3/5 flex-col items-center justify-center">
        <div className="flex md:hidden flex-col items-center mb-6 w-screen bg-[rgb(222,224,244)] mt-0 p-4">
          <img
            src="/public/manit_logo.png"
            alt="NIT Bhopal Logo"
            className="w-24 mb-4"
          />
          <h1 className="text-xl font-bold text-center text-[rgba(16,76,144,1)]">
            MAULANA AZAD
          </h1>
          <h2 className="text-lg font-bold text-center text-[rgba(16,76,144,1)]">
            NATIONAL INSTITUTE OF TECHNOLOGY
          </h2>
          <h3 className="text-base font-bold text-center text-[rgba(16,76,144,1)]">
            BHOPAL
          </h3>
        </div>

        <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-[rgba(16,76,144,1)]">
            Sign In
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="text"
                placeholder="abc@manit.ac.in"
                required
                className="mt-1  text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                className="mt-1  text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="role" value="Role" />
              <Select
                id="role"
                className="mt-1  text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="COMPLAINER">Student/Faculty </option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-4 mt-4">
              {/* Remember Me Section */}
              {/* <div className="flex items-center">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="ml-2">
                      Remember me
                    </Label>
                  </div> */}

              {/* Forgot Password Link */}
              <a
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full mb-2 bg-[rgba(16,76,144,1)] enabled:hover:bg-[rgba(16,76,144,0.9)]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm mt-4">
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </form>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
