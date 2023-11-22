import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";

interface Errors {
  name?: string;
  surname?: string;
  gender?: string;
  birthDate?: string;
  email?: string;
  password?: string;
}

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, surname, gender, birthDate } = body;

    let errors: Errors = {};

    if (!name) {
      errors.name = "Name is required";
    } else if (name.length > 30) {
      errors.name = "Name must be max 30 characters long";
    }

    if (!surname) {
      errors.surname = "Surname is required";
    } else if (surname.length > 30) {
      errors.surname = "Surname must be max 30 characters long";
    }

    if (!gender) {
      errors.gender = "Gender is required";
      // check if the value of gender is listed in the Gender enum
    } else if (!Object.values(Gender).includes(gender as Gender)) {
      errors.gender = "Invalid gender";
    }

    if (!birthDate) {
      errors.birthDate = "Birth date is required";
    } // Check if 'birthDate' is not a valid date.
    if (isNaN(Date.parse(birthDate))) {
      // If 'birthDate' is invalid, 'Date.parse' will return 'NaN' (Not a Number).
      // 'isNaN' will then return 'true', indicating the date is not valid.
      errors.birthDate = "Invalid birth date";
    }

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
      errors.password = "Password must be max 50 characters";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // check if user already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User already exists" },
        { status: 409 }
      );
    }

    // hash password
    const hashedPassword = await hash(password, 10);

    // create user
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        gender,
        birthDate,
      },
    });

    // remove password from response
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
