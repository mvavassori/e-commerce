import Link from "next/link";

const OrderCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Order Cancelled</h1>
        <p className="text-lg mb-6">Your order has been cancelled.</p>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          href="/"
        >
          Go back to the home page
        </Link>
      </div>
    </div>
  );
};

export default OrderCancelled;
