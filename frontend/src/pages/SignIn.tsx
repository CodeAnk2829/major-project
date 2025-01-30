import {
  Alert,
  Button,
  Label,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "STUDENT", // Default role
  });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const {currentUser} = useSelector((state) => state.user);
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }  

    try {
      dispatch(signInStart());
      const res = await fetch("/api/v1/user/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.token);

      if (data.ok === false) {
        dispatch(signInFailure(data.error));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/role-redirect");
      }
    } catch (error: any) {
      dispatch(signInFailure(error.message));
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
                className="mt-1  text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
                theme={customThemeTi}
              />
            </div>

            <div>
              <Label htmlFor="role" value="Role" />
              <Select
                id="role"
                className="mt-1  text-gray-900 text-sm rounded-lg"
                onChange={handleChange}
                value={formData.role}
                theme={customThemeSelect}
              >
                <option value="STUDENT">Student </option>
                <option value="FACULTY">Faculty </option>
                <option value="ISSUE_INCHARGE">Issue Incharge</option>
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
              className="w-full mb-2 bg-[rgba(60,79,131,1)] enabled:hover:bg-[rgba(16,76,144,0.9)]"
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
              {" "}
              <span>Don't have an account? </span>
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
