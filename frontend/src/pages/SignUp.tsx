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
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT", 
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const customThemeTi = {
    base: "flex",
    addon:
      "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
    field: {
      base: "relative w-full",
      icon: {
        base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      rightIcon: {
        base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        sizes: {
          sm: "p-2 sm:text-xs",
          md: "p-2.5 text-sm",
          lg: "p-4 sm:text-base",
        },
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          failure:
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
        },
        withRightIcon: {
          on: "pr-10",
          off: "",
        },
        withIcon: {
          on: "pl-10",
          off: "",
        },
        withAddon: {
          on: "rounded-r-lg",
          off: "rounded-lg",
        },
        withShadow: {
          on: "shadow-sm dark:shadow-sm-light",
          off: "",
        },
      },
    },
  };
  const customThemeSelect = {
    base: "flex",
    addon:
      "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
    field: {
      base: "relative w-full",
      icon: {
        base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        withIcon: {
          on: "pl-10",
          off: "",
        },
        withAddon: {
          on: "rounded-r-lg",
          off: "rounded-lg",
        },
        withShadow: {
          on: "shadow-sm dark:shadow-sm-light",
          off: "",
        },
        sizes: {
          sm: "p-2 sm:text-xs",
          md: "p-2.5 text-sm",
          lg: "p-4 sm:text-base",
        },
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-[rgb(60,79,131)] focus:ring-[rgb(60,79,131)] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
          failure:
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500 dark:focus:ring-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500 dark:focus:ring-green-500",
        },
      },
    },
  };

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
    if (formData.phoneNumber.length !== 10) {
      return setErrorMessage("Phone Number must be 10 digits");
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      (document.getElementById("confirmPassword") as HTMLInputElement)?.focus();
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { confirmPassword, ...dataToSend } = formData;
      const res = await fetch("/api/v1/user/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
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
        <h1 className="text-2xl font-bold text-center text-[rgba(60,79,131,1)]">
          MAULANA AZAD
        </h1>
        <h2 className="text-xl font-bold text-center text-[rgba(60,79,131,1)]">
          NATIONAL INSTITUTE OF TECHNOLOGY
        </h2>
        <h3 className="text-lg font-bold text-center text-[rgba(60,79,131,1)]">
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
          <h1 className="text-xl font-bold text-center text-[rgba(60,79,131,1)]">
            MAULANA AZAD
          </h1>
          <h2 className="text-lg font-bold text-center text-[rgba(60,79,131,1)]">
            NATIONAL INSTITUTE OF TECHNOLOGY
          </h2>
          <h3 className="text-base font-bold text-center text-[rgba(60,79,131,1)]">
            BHOPAL
          </h3>
        </div>

        <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-[rgba(60,79,131,1)]">
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
                theme={customThemeTi}
              />
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <Label htmlFor="phoneNumber" value="Phone Number" />
              <TextInput
                id="phoneNumber"
                type="phoneNumber"
                placeholder="1234567890"
                required
                className="mt-1 text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
                theme={customThemeTi}
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
                theme={customThemeTi}
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
                theme={customThemeTi}
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
                theme={customThemeTi}
              />
            </div>

            <div>
              <Label htmlFor="role" value="Role" />
              <Select
                id="role"
                className="mt-1  text-gray-900 text-sm rounded-lg mb-4"
                onChange={handleChange}
                value={formData.role}
                theme={customThemeSelect}
              >
                <option value="STUDENT">Student </option>
                <option value="FACULTY">Faculty </option>
                {/* <option value="ADMIN">Admin</option> */}
              </Select>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full mb-2 bg-[rgba(60,79,131,1)] enabled:hover:bg-[rgba(16,76,144,0.9)]"
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
