"use client";

import { useState } from "react";
import Link from "next/link";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCartMenu = () => setIsOpen(!isOpen);
  return (
    <div className="">
      <div className="flex w-full">
        <div
          className={`fixed top-0 left-0 bottom-0 w-5/6 max-w-sm bg-white z-20 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          {/* Menu Items */}
          <div className="mt-12 flex flex-col items-start p-4">
            <Link
              href="/"
              className="text-lg block p-2 w-full"
              onClick={toggleCartMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-lg block p-2 w-full"
              onClick={toggleCartMenu}
            >
              About
            </Link>
            {/* Add other links similarly */}
          </div>
        </div>
        {/* Toggle Button */}
      </div>
      <button onClick={toggleCartMenu} className="z-30">
        {isOpen ? <CloseIcon /> : <CartIcon />}
      </button>
    </div>
  );
}
