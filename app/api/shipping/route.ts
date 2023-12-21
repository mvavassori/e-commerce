// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// interface ShippingErrors {
//   name?: string;
//   surname?: string;
//   address?: string;
//   city?: string;
//   postalCode?: string;
//   country?: string;
//   stateOrProvince?: string;
// }

// export async function POST(req: Request) {
//   const authSession = await getServerSession(authOptions);
//   if (!authSession || !authSession.user || !authSession.user.id) {
//     return NextResponse.json(
//       { message: "You must be logged in to perform this action." },
//       { status: 401 }
//     );
//   }
//   try {
//     const body = await req.json();
//     const {
//       name,
//       surname,
//       address,
//       city,
//       postalCode,
//       country,
//       stateOrProvince,
//     } = body;

//     let errors: ShippingErrors = {};

//     if (!name) {
//       errors.name = "Name is required";
//     } else if (name.length > 30) {
//       errors.name = "Name must be max 30 characters long";
//     }
//     if (!surname) {
//       errors.surname = "Surname is required";
//     } else if (surname.length > 30) {
//       errors.surname = "Surname must be max 30 characters long";
//     }
//     if (!address) {
//       errors.address = "Address is required";
//     } else if (address.length > 100) {
//       errors.address = "address must be max 100 characters long";
//     }
//     if (!city) {
//       errors.city = "City is required";
//     } else if (city.length > 30) {
//       errors.city = "City must be max 30 characters long";
//     }
//     if (!postalCode) {
//       errors.postalCode = "Postal code is required";
//     } else if (postalCode.length > 10) {
//       errors.postalCode = "Postal code must be max 10 characters long";
//     }
//     if (!country) {
//       errors.country = "Country is required";
//     } else if (country.length > 30) {
//       errors.country = "Country must be max 30 characters long";
//     }
//     if (!stateOrProvince) {
//       errors.stateOrProvince = "State or province is required";
//     } else if (stateOrProvince.length > 30) {
//       errors.stateOrProvince =
//         "State / Province must be max 30 characters long";
//     }

//     if (Object.keys(errors).length > 0) {
//       return NextResponse.json({ errors }, { status: 400 });
//     }

//     // Logic to handle shipping information (e.g., create or update shipping info in the database)
//     const newShippingInfo = await db.shippingInformation.create({
//       data: {
//         name,
//         addressLine1,
//         addressLine2,
//         city,
//         postalCode,
//         country,
//         stateOrProvince,
//         userId: parseInt(authSession.user.id),
//       },
//     });

//     return NextResponse.json(
//       { newShippingInfo, message: "Shipping information saved successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in shipping route:", error);
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
