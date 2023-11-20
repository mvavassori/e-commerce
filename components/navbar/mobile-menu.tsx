"use client";
import { useState } from "react";
import Link from "next/link";
import Hamburger from "../icons/Hamburger";
import Close from "../icons/Close";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex md:hidden w-full p-2">
      {" "}
      {/* This ensures the div takes the full width */}
      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-white text-black z-10 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Menu Items */}
        <div className="flex flex-col items-start p-4 space-y-3">
          {/* Corrected usage of Link components */}
          <Link
            href="/"
            className="text-lg block p-2"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-lg block p-2"
            onClick={toggleMobileMenu}
          >
            About
          </Link>
          {/* Add other links similarly */}
        </div>
      </div>
      {/* Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="ml-auto p-2 z-20" // ml-auto will push the button to the right side of the flex container
      >
        {isOpen ? <Close /> : <Hamburger />}
      </button>
    </div>
  );
}
