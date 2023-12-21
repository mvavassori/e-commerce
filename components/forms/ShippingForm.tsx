// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// interface Errors {
//   name?: string;
//   surname?: string;
//   address?: string;
//   city?: string;
//   postalCode?: string;
//   country?: string;
//   stateOrProvince?: string;
// }

// export default function ShippingInfoForm() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [surname, setSurname] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [country, setCountry] = useState("");
//   const [stateOrProvince, setStateOrProvince] = useState("");

//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
//     null
//   );

//   const [errors, setErrors] = useState<Errors>({});

//   const validateForm = () => {
//     let errors: Errors = {};

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

//     setErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitted(true);

//     const isFormValid = validateForm();
//     if (isFormValid) {
//       console.log("Submit shipping info");
//       // Handle form submission logic
//       const shippingInfo = {
//         name,
//         surname,
//         address,
//         city,
//         postalCode,
//         country,
//         stateOrProvince,
//       };
//       try {
//         const response = await fetch("api/shipping", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(shippingInfo),
//         });

//         if (response.ok) {
//           console.log("Form submitted successfully!", shippingInfo);
//           // Redirect to checkout page
//           //   router.push("/checkout");
//         } else {
//           const errorData = await response.json();
//           setServerErrorMessage(errorData.message); // Assuming the server responds with a JSON object that has a 'message' property
//         }
//       } catch (error) {
//         // Handle fetch error
//         console.error("An error occurred while sending the data:", error);
//       }
//     } else {
//       console.error("Submission error");
//     }
//   };

//   return (
//     <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mx-auto">
//       <div className="w-full p-6 m-auto bg-white rounded-md md:max-w-xl">
//         <h1 className="text-3xl font-semibold text-center text-blue-600 mb-12">
//           Shipping Information
//         </h1>
//         <form onSubmit={handleSubmit}>
//           {/* Name Input */}
//           <div className="md:flex justify-between mb-4">
//             {/* Name */}
//             <div className="mb-4 md:mb-0">
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-semibold text-gray-800"
//               >
//                 Name
//               </label>
//               <input
//                 onChange={(e) => setName(e.target.value)}
//                 value={name}
//                 type="text"
//                 placeholder="John"
//                 className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//               {isSubmitted && errors.name && (
//                 <p className="text-red-500 text-sm mb-2">{errors.name}</p>
//               )}
//             </div>
//             {/* Surame */}
//             <div>
//               <label
//                 htmlFor="surname"
//                 className="block text-sm font-semibold text-gray-800"
//               >
//                 Surname
//               </label>
//               <input
//                 onChange={(e) => setSurname(e.target.value)}
//                 value={surname}
//                 type="text"
//                 placeholder="Doe"
//                 className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//               {isSubmitted && errors.surname && (
//                 <p className="text-red-500 text-sm mb-2">{errors.surname}</p>
//               )}
//             </div>
//           </div>
//           {/* Address */}
//           <div className="mb-4">
//             <label
//               htmlFor="street"
//               className="block text-sm font-semibold text-gray-800"
//             >
//               Address
//             </label>
//             <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="123 Main St"
//               className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
//             />
//             {isSubmitted && errors.address && (
//               <p className="text-red-500 text-sm mb-2">{errors.address}</p>
//             )}
//           </div>

//           {/* City */}
//           <div className="mb-4">
//             <label
//               htmlFor="city"
//               className="block text-sm font-semibold text-gray-800"
//             >
//               City
//             </label>
//             <input
//               type="text"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               placeholder="New York"
//               className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
//             />
//             {isSubmitted && errors.city && (
//               <p className="text-red-500 text-sm mb-2">{errors.city}</p>
//             )}
//           </div>

//           {/* Country */}
//           <div className="mb-4">
//             <label
//               htmlFor="country"
//               className="block text-sm font-semibold text-gray-800"
//             >
//               Country
//             </label>
//             <input
//               type="text"
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               placeholder="USA"
//               className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
//             />
//             {isSubmitted && errors.country && (
//               <p className="text-red-500 text-sm mb-2">{errors.country}</p>
//             )}
//           </div>

//           {/* Postal Code */}
//           <div className="mb-4">
//             <label
//               htmlFor="postalCode"
//               className="block text-sm font-semibold text-gray-800"
//             >
//               Postal Code
//             </label>
//             <input
//               type="text"
//               value={postalCode}
//               onChange={(e) => setPostalCode(e.target.value)}
//               placeholder="10001"
//               className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
//             />
//             {isSubmitted && errors.postalCode && (
//               <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>
//             )}
//           </div>

//           {/* State / Province */}
//           <div className="mb-4">
//             <label
//               htmlFor="stateOrProvince"
//               className="block text-sm font-semibold text-gray-800"
//             >
//               State / Province
//             </label>
//             <input
//               type="text"
//               value={stateOrProvince}
//               onChange={(e) => setStateOrProvince(e.target.value)}
//               placeholder="NY"
//               className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:outline-none"
//             />
//             {isSubmitted && errors.stateOrProvince && (
//               <p className="text-red-500 text-sm mb-2">
//                 {errors.stateOrProvince}
//               </p>
//             )}
//           </div>
//           {/* Submit Button */}
//           <div className="mt-6">
//             <button
//               type="submit"
//               className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mb-12"
//             >
//               Save Shipping Info
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
