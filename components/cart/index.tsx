"use client";

import { useState } from "react";
import Link from "next/link";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCartMenu = () => setIsOpen(!isOpen);

  // Close the cart when the overlay is clicked
  const closeCart = () => setIsOpen(false);

  return (
    <div className="">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeCart}
        ></div>
      )}

      <div className="flex w-full">
        {/* Cart Modal */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-white z-20 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <button onClick={toggleCartMenu} className="absolute top-5 left-5">
            <CloseIcon />
          </button>
          {/* TODO cart elements */}
        </div>
      </div>
      {/* Toggle Button */}
      <button onClick={toggleCartMenu} className="">
        <CartIcon />
      </button>
    </div>
  );
}
