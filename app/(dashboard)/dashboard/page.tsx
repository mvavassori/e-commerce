import UserDashboardNav from "@/components/UserDashboardNav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// I'm redirecting through middleware.

const UserDashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log("adminsession", session);
  return (
    <>
      <div>User Dashboard of {session?.user.name}</div>
      <UserDashboardNav />
    </>
  );
};

export default UserDashboard;
