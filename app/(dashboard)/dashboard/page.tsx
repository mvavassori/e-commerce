import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import DashboardOrders from "@/components/DashboardOrders";

// I'm redirecting through middleware.

const UserDashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log("adminsession", session);
  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-10 mb-12">
      <div className="md:flex">
        <div className="bg-gray-100 rounded-lg p-4 md:mr-4">
          <h2 className="font-bold text-3xl mb-4">Profile Info</h2>
          <p className=" text-gray-700">Hi there,</p>
          <p className="font-bold">
            {session?.user.name} {session?.user.surname}
          </p>
          <p className="text-gray-700">Customer id: {session?.user.id}</p>
          <p className="text-gray-700">Email: {session?.user.email}</p>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-bold text-3xl mb-4">Profile Actions</h2>
          {/* <div>
            <Link href="/change-password" className="hover:underline">
              Change password
            </Link>
          </div>
          <div>
            <Link href="/change-email" className="hover:underline">
              Change email
            </Link>
          </div> */}
          <SignOutButton />
        </div>
      </div>

      <div>
        <DashboardOrders />
      </div>
    </div>
  );
};

export default UserDashboard;
