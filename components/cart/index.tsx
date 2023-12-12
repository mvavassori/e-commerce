"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";
import UnauthenticatedCart from "./UnauthenticatedCart";
import AuthenticatedCart from "./AuthenticatedCart";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, status } = useSession();

  const toggleCartMenu = () => setIsOpen(!isOpen);

  const closeCart = () => setIsOpen(false);

  // console.log(cartItems);

  const renderCart = () => {
    if (status === "loading") {
      return <p>Loading...</p>;
    } else if (status === "unauthenticated") {
      return <UnauthenticatedCart />;
    } else if (status === "authenticated") {
      return <AuthenticatedCart />;
    }
  };

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
          <button onClick={toggleCartMenu} className="absolute top-5 right-5">
            <CloseIcon />
          </button>
          {/* Cart Content */}
          {renderCart()}
        </div>
      </div>
      {/* Toggle Button */}
      <button onClick={toggleCartMenu} className="">
        <CartIcon />
      </button>
    </div>
  );
}
