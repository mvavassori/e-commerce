"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserIcon from "../icons/UserIcon";

export default function ButtonHandler() {
  const { status } = useSession();
  if (status === "loading") {
    return null; // Renders nothing while loading
  }
  return (
    <>
      {status === "authenticated" ? (
        <Link href="/dashboard" className="mr-6 hidden md:block">
          <UserIcon />
        </Link>
      ) : (
        <Link
          href="/signin"
          className="hidden md:block mr-4 text-sm hover:bg-blue-600 justify-end bg-blue-500 text-white px-2 py-1 rounded-full"
        >
          Sign In
        </Link>
      )}
    </>
  );
}
