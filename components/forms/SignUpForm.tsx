"use client";

import { useState } from "react";

interface Errors {
  name?: string;
  surname?: string;
  gender?: string;
  birthDate?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

interface NewUser {
  name: string;
  surname: string;
  gender: Gender;
  birthDate: string; // ISO string for date
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate options for birth date selectors
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 2023 - 1905 + 1 }, (_, i) => i + 1905);

  // Validate form before sending to backend
  const validateForm = () => {
    let errors: Errors = {};

    if (!name) {
      errors.name = "Name is required";
    } else if (name.length > 30) {
      errors.name = "Name must be max 30 characters";
    }

    if (!surname) {
      errors.surname = "Surname is required";
    } else if (surname.length > 30) {
      errors.surname = "Surname must be max 30 characters";
    }

    if (!gender) {
      errors.gender = "Gender is required";
    }

    if (!birthDay || !birthMonth || !birthYear) {
      errors.birthDate = "Complete birth date is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (password.length > 50) {
      errors.password = "Password must be max 50 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Client side validation with error messages on submit.
    const isFormValid = validateForm();

    // Data preparation for db formatting
    const combinedBirthDate = `${birthYear}-${birthMonth.padStart(
      2,
      "0"
    )}-${birthDay.padStart(2, "0")}T00:00:00.000Z`;
    const upperCaseGender = gender.toUpperCase() as Gender;

    // Convert gender to uppercase for db formatting
    if (gender === "Male") {
      setGender("MALE");
    } else if (gender === "Female") {
      setGender("FEMALE");
    } else if (gender === "Other") {
      setGender("OTHER");
    }

    if (isFormValid) {
      const newUser: NewUser = {
        name,
        surname,
        gender: upperCaseGender,
        birthDate: combinedBirthDate,
        email,
        password,
      };
      console.log("Form submitted successfully!", newUser);
    } else {
      console.log("Form has errors. Please correct them.");
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mx-auto mb-12">
      <div className="w-full p-6 m-auto bg-white rounded-md md:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-12">
          Sign Up
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="md:flex justify-between mb-4">
            {/* Name */}
            <div className="mb-4 md:mb-0">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-800"
              >
                Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="name"
                className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {isSubmitted && errors.name && (
                <p className="text-red-500 text-sm mb-2">{errors.name}</p>
              )}
            </div>
            {/* Surame */}
            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-semibold text-gray-800"
              >
                Surname
              </label>
              <input
                onChange={(e) => setSurname(e.target.value)}
                value={surname}
                type="surname"
                className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {isSubmitted && errors.surname && (
                <p className="text-red-500 text-sm mb-2">{errors.surname}</p>
              )}
            </div>
          </div>
          {/* Gender radio inputs */}
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Gender
            </label>
            {/* Radio options */}
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio"
                />
                <span className="ml-2">{g}</span>
              </label>
            ))}
            {isSubmitted && errors.gender && (
              <p className="text-red-500 text-sm mb-2">{errors.gender}</p>
            )}
          </div>
          {/* Birth date selectors*/}
          <div className="mb-4">
            <label
              htmlFor="birthDate"
              className="block text-sm font-semibold text-gray-800"
            >
              Birth Date
            </label>
            <div className="flex gap-3">
              {/* Birth Day */}
              <select
                onChange={(e) => setBirthDay(e.target.value)}
                value={birthDay}
                className="block w-24 px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              >
                <option value="">Day</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {/* Birth Month */}
              <select
                onChange={(e) => setBirthMonth(e.target.value)}
                value={birthMonth}
                className="block w-24 px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              >
                <option value="">Month</option>
                {months.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {/* Birth Year */}
              <select
                onChange={(e) => setBirthYear(e.target.value)}
                value={birthYear}
                className="block w-24 px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              >
                <option value="">Year</option>
                {years.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            {isSubmitted && errors.birthDate && (
              <p className="text-red-500 text-sm mb-2">{errors.birthDate}</p>
            )}
          </div>
          {/* Email */}
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
            {isSubmitted && errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            )}
          </div>
          {/* Password */}
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
            {isSubmitted && errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
          </div>
          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-800"
            >
              Confirm Password
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {isSubmitted && errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
