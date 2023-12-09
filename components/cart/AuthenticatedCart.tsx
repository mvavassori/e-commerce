import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import QuantityInput from "../QuantityInput";
import {
  ProductVariant,
  Product,
  ProductImage,
  CartItem,
  Cart,
} from "@prisma/client";

interface FetchedItem extends ProductVariant {
  product: Product & {
    images: ProductImage[];
  };
}

interface ExtendedCartItem extends CartItem {
  productVariant: FetchedItem;
}

interface FetchedCart extends Cart {
  items: ExtendedCartItem[];
  subTotal: number; // Calculated subtotal from the backend
}

export default function AuthenticatedCart() {
  const {
    cartItems,
    handleQuantityChange,
    removeItemFromCart,
    subTotal,
    serverCart,
  } = useCart();
  console.log(serverCart);

  const isCartEmpty = !serverCart || serverCart.cart.items.length === 0;
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold">Your Cart</h2>
      {isCartEmpty ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart Items */}
          {serverCart?.cart.items.map((item: ExtendedCartItem) => (
            <div key={item.id} className="flex items-center justify-between">
              <Image
                src={item.productVariant.product.images[0].url}
                alt={item.productVariant.product.name}
                height={50}
                width={50}
                className="w-20 h-20 object-cover"
              />
              <div>
                <p>{item.productVariant.product.name}</p>
                <p>$ {item.price.toFixed(2)}</p>
                {/* Displaying product attributes */}
                {item.productVariant.attributes &&
                  typeof item.productVariant.attributes === "object" && (
                    <ul>
                      {Object.entries(item.productVariant.attributes).map(
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
            <p>Subtotal: $ {serverCart?.subTotal.toFixed(2)}</p>
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
