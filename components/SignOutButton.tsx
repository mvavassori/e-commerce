"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/signin`,
        })
      }
      className=" text-red-500 rounded-md font-bold hover:text-red-600 hover:underline"
    >
      Sign Out
    </button>
  );
}
