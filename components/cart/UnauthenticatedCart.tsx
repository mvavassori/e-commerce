import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import QuantityInput from "../QuantityInput";
import { ProductVariant, Product, ProductImage } from "@prisma/client";

interface FetchedItem extends ProductVariant {
  product: Product & {
    images: ProductImage[];
  };
}

interface ExtendedProductVariant extends FetchedItem {
  quantity: number;
}

export default function UnauthenticatedCart() {
  const { cartItems, handleQuantityChange, removeItemFromCart, subTotal } =
    useCart();
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart Items */}
          {cartItems.map((item: ExtendedProductVariant) => (
            <div key={item.id} className="flex items-center justify-between">
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
                {item.attributes && typeof item.attributes === "object" && (
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
  );
}
