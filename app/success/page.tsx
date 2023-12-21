import Link from "next/link";

export default function Sucess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="mb-6 text-lg">
          Thank you for your purchase. Your order is being processed and you
          will receive a confirmation email shortly.
        </p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go back to the home page
        </Link>
      </div>
    </div>
  );
}
