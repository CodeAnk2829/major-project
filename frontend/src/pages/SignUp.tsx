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

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT", // Hardcoded to match the expected value
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return setErrorMessage("Please fill in all fields");
    }

    if (formData.password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters long");
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      (document.getElementById("confirmPassword") as HTMLInputElement)?.focus();
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("http://localhost:3000/api/v1/user/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign Up failed");
      }

      localStorage.setItem("token", data.token);
      setLoading(false);
      // alert("Sign Up Successful! Redirecting to Sign In...");
      navigate("/sign-in");
    } catch (error: any) {
      console.log(error);
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
            Sign Up
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <Label htmlFor="name" value="Full Name" />
              <TextInput
                id="name"
                type="text"
                placeholder="Your Name"
                required
                className="mt-1 text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                placeholder="abc@manit.ac.in"
                required
                className="mt-1 text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                placeholder="******"
                required
                className="mt-1 text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
              />
            </div>
            {/* Confirm Password Field */}
            <div className="mb-4">
              <Label htmlFor="confirmPassword" value="Confirm Password" />
              <TextInput
                id="confirmPassword"
                type="password"
                placeholder="******"
                required
                className="mt-1 text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="role" value="Role" />
              <Select
                id="role"
                className="mt-1  text-gray-900 text-sm rounded-lg mb-4"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="STUDENT">Student </option>
                <option value="FACULTY">Faculty </option>
                {/* <option value="ADMIN">Admin</option> */}
              </Select>
            </div>

            {/* Sign Up Button */}
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
                "Sign Up"
              )}
            </Button>

            {/* Already have an account */}
            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500">
                Sign In
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

export default SignUp;
