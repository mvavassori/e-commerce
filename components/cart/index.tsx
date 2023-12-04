"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";
import QuantityInput from "../QuantityInput";
import { useSession } from "next-auth/react";

interface LocalCartItem {
  productVariantId: string;
  quantity: number;
}

export default function Cart() {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  const toggleCartMenu = () => setIsOpen(!isOpen);

  // Close the cart when the overlay is clicked
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      // Retrieve cart items from localStorage
      const localCart: LocalCartItem[] | null = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      if (localCart) {
        fetchItemDetails(localCart);
      }
    }
  }, [status]);

  const fetchItemDetails = async (localCart: LocalCartItem[]) => {
    // Make API call to add item to cart in database
    const response = await fetch("/api/item-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productVariantIds: localCart?.map((item) => item.productVariantId),
      }),
    });

    const data = await response.json();

    // console.log(data); // Handle the response data

    setCartItems(data);
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
          <div className="p-5">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                {/* Cart Items */}
                {cartItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      height={50}
                      width={50}
                      className="w-20 h-20 object-cover"
                    />
                    <div>
                      <p>{item.product.name}</p>
                      <p>{item.price}</p>
                    </div>
                    <QuantityInput
                      onChange={() => setQuantity(quantity)}
                      // Add onChange handler to update quantity
                    />
                    <p>$ {item.price * quantity}</p>
                    <button
                    // Add onClick handler to remove item
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Cart Summary */}
                <div>
                  <p>Subtotal: $ 100</p>
                  <button>Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
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
