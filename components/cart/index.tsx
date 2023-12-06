"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";
import QuantityInput from "../QuantityInput";
import { ProductVariant, Product, ProductImage } from "@prisma/client";
import { useCart } from "@/context/CartContext";

interface FetchedItem extends ProductVariant {
  product: Product & {
    images: ProductImage[];
  };
}

interface ExtendedProductVariant extends FetchedItem {
  quantity: number;
}

interface ProductAttribute {
  [key: string]: string;
}

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);

  const { cartItems, handleQuantityChange, subTotal, removeItemFromCart } =
    useCart();

  const toggleCartMenu = () => setIsOpen(!isOpen);

  // Close the cart when the overlay is clicked
  const closeCart = () => setIsOpen(false);

  // console.log(cartItems);

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
                {cartItems.map((item: ExtendedProductVariant) => (
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
                      <p>$ {item.price.toFixed(2)}</p>
                      {/* Displaying product attributes */}
                      {item.attributes &&
                        typeof item.attributes === "object" && (
                          <ul>
                            {Object.entries(item.attributes).map(
                              ([attributeKey, attributeValue]) => {
                                // Convert attributeValue to a displayable format
                                let displayValue;
                                if (
                                  attributeValue === null ||
                                  attributeValue === undefined
                                ) {
                                  displayValue = "N/A";
                                } else if (typeof attributeValue === "object") {
                                  displayValue = JSON.stringify(attributeValue);
                                } else {
                                  displayValue = attributeValue.toString();
                                }

                                return (
                                  <li key={attributeKey}>
                                    {attributeKey}: {displayValue}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        )}
                    </div>
                    <QuantityInput
                      initialQuantity={item.quantity}
                      onChange={(newQuantity) =>
                        handleQuantityChange(item.id, newQuantity)
                      }
                    />
                    <p>$ {(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItemFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}

                {/* Cart Summary */}
                <div>
                  {/* <p>Subtotal: $ {calculateSubtotal()}</p> */}
                  <p>Subtotal: $ {subTotal.toFixed(2)}</p>
                  <Link
                    href="/checkout"
                    className="bg-blue-500 text-white py-2 px-16 rounded-full font-semibold"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Toggle Button */}
      <button onClick={toggleCartMenu} className="">
        <CartIcon />
      </button>
    </div>
  );
}
