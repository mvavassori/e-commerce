export default function Sucess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your order is being processed and you
          will receive a confirmation email shortly.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Go back to the homepage
        </a>
      </div>
    </div>
  );
}
