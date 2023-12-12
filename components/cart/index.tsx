"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";
import UnauthenticatedCart from "./UnauthenticatedCart";
import AuthenticatedCart from "./AuthenticatedCart";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);

  const { status } = useSession();

  const { cartItems, serverCart } = useCart();
  console.log(cartItems);

  const toggleCartMenu = () => setIsOpen(!isOpen);

  const closeCart = () => setIsOpen(false);

  const getItemCount = () => {
    if (status === "unauthenticated") {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    } else if (status === "authenticated") {
      return (
        serverCart?.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        ) || 0
      );
    }
    return 0;
  };

  const itemCount = getItemCount();

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
      <div className="relative inline-block">
        <button onClick={toggleCartMenu} className="">
          <CartIcon />
        </button>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[9px] rounded-md px-1.5">
            {itemCount}
          </span>
        )}
      </div>
    </div>
  );
}
