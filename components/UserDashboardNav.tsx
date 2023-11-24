"use client";

import { signOut } from "next-auth/react";

export default function UserDashboardNav() {
  return (
    <button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/signin`,
        })
      }
      className="bg-red-600 text-white rounded-full px-2"
    >
      Sign Out
    </button>
  );
}
