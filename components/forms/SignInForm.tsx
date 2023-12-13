"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface Errors {
  email?: string;
  password?: string;
}

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
    null
  );

  const validateForm = () => {
    let errors: Errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (password.length > 50) {
      errors.password = "Password must be max 50 characters long";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        const signInData = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (signInData?.error) {
          // Handle known errors or generic ones
          const errorMessage =
            signInData.error === "CredentialsSignin"
              ? "Invalid email and/or password"
              : "An unexpected error occurred, please try again.";
          setServerErrorMessage(errorMessage);
        } else {
          // Successfully signed in
          sessionStorage.setItem("isLoggingIn", "true");
          window.location.href = "/dashboard";
        }
      } catch (error) {
        // Handle errors from the signIn call itself (e.g., network errors)
        console.error("Sign in error:", error);
        setServerErrorMessage("Failed to connect, please try again.");
      }
    } else {
      // Form validation failed
      console.log("Sign in failed");
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mx-auto">
      <div className="w-full p-6 m-auto bg-white rounded-md md:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-12">
          Sign in
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
          </div>
          <Link
            href="/passwordreset"
            className="text-xs text-blue-600 hover:underline"
          >
            Forget Password?
          </Link>
          <div className="mt-6">
            {serverErrorMessage && (
              <div className="text-red-500 text-sm mb-2">
                {serverErrorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="relative flex items-center justify-center w-full mt-6 border border-t">
          <div className="absolute px-5 bg-white">Or</div>
        </div>
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Creare an account
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
