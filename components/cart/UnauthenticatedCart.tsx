import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import QuantityInput from "../QuantityInput";
import { ProductVariant, Product, ProductImage } from "@prisma/client";
import RemoveIcon from "../icons/RemoveIcon";

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

  const isCartEmpty = !cartItems || cartItems.length === 0;
  return (
    <div className="flex flex-col h-full p-5">
      <h2 className="text-lg font-semibold mb-4">Your Cart</h2>

      {isCartEmpty ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col h-[calc(100%-3rem)]">
          {/* Scrollable Cart Items */}
          <div className="flex-grow overflow-y-auto">
            {/* Cart Items */}
            {cartItems.map((item: ExtendedProductVariant) => (
              <div
                key={item.id}
                className="flex items-start justify-between mb-4 p-2 border-b"
              >
                {/* Product Image */}
                <div className="w-20 flex-shrink-0">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    height={50}
                    width={50}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow ml-4">
                  {/* Product Name */}
                  <p className="text-lg font-semibold">{item.product.name}</p>

                  {/* Product Attributes */}
                  <p className="text-sm text-gray-600">
                    {item.attributes &&
                      typeof item.attributes === "object" &&
                      Object.entries(item.attributes)
                        .map(([attributeKey, attributeValue]) =>
                          attributeValue?.toString()
                        )
                        .join(" / ")}
                  </p>
                </div>

                {/* Quantity, Price, and Remove Button */}
                <div className="flex flex-col items-end">
                  <p className="text-lg font-semibold">
                    $ {item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="mt-1 mb-1 px-2 py-1 text-xs rounded hover:text-red-500"
                  >
                    <RemoveIcon />
                  </button>
                  <QuantityInput
                    initialQuantity={item.quantity}
                    onChange={(newQuantity) =>
                      handleQuantityChange(item.id, newQuantity)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Subtotal: $ {subTotal.toFixed(2)}
            </p>
            <Link
              href="/checkout"
              className="block w-full bg-blue-500 text-white text-center py-2 mt-4 rounded-full font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
