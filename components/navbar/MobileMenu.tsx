"use client";
import { useState } from "react";
import Link from "next/link";
import HamburgerIcon from "../icons/HamburgerIcon";
import CloseIcon from "../icons/CloseIcon";
import { useSession } from "next-auth/react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  // Close the mobile menu when the overlay is clicked
  const closeMobileMenu = () => setIsOpen(false);

  const { data: session, status } = useSession();

  return (
    <div>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeMobileMenu}
        ></div>
      )}
      <div className="flex w-full">
        <div
          className={`fixed top-0 left-0 bottom-0 w-5/6 max-w-sm bg-white z-20 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          {/* Menu Items */}
          <div className="mt-12 flex flex-col items-start p-4">
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="text-lg block p-2 w-full"
                onClick={toggleMobileMenu}
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/signin"
                className="text-lg block p-2 w-full"
                onClick={toggleMobileMenu}
              >
                Sign In
              </Link>
            )}

            <Link
              href="/"
              className="text-lg block p-2 w-full"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/all-products"
              className="text-lg block p-2 w-full"
              onClick={toggleMobileMenu}
            >
              Products
            </Link>
            <Link
              href="/products/TS-001"
              className="text-lg block p-2 w-full"
              onClick={toggleMobileMenu}
            >
              T-shirt
            </Link>
            <Link
              href="/about"
              className="text-lg block p-2 w-full"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            {/* Add other links similarly */}
          </div>
        </div>
        {/* Toggle Button */}
        <button onClick={toggleMobileMenu} className="z-30">
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>
    </div>
  );
}
