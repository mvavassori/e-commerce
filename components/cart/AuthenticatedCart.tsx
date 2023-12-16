import { useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import QuantityInput from "../QuantityInput";
import {
  ProductVariant,
  Product,
  ProductImage,
  CartItem,
} from "@prisma/client";
import RemoveIcon from "../icons/RemoveIcon";

interface FetchedItem extends ProductVariant {
  product: Product & {
    images: ProductImage[];
  };
}

interface ExtendedCartItem extends CartItem {
  productVariant: FetchedItem;
}

function debounce<F extends (...args: any[]) => void>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) => {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function AuthenticatedCart() {
  const { serverCart, handleServerQuantityChange, removeServerItemFromCart } =
    useCart();

  const debouncedQuantityChange = useMemo(
    () => debounce(handleServerQuantityChange, 500),
    [handleServerQuantityChange]
  );

  const isCartEmpty = !serverCart || serverCart.cart.items.length === 0;

  console.log(serverCart?.cart.items);

  const checkout = async () => {
    await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: serverCart?.cart.items }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log(res);
        if (res.url) {
          window.location.href = res.url;
        }
      });
  };

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
            {serverCart?.cart.items.map((item: ExtendedCartItem) => (
              <div
                key={item.id}
                className="flex items-start justify-between mb-4 p-2 border-b"
              >
                {/* Product Image */}
                <div className="w-20 flex-shrink-0">
                  <Image
                    src={item.productVariant.product.images[0].url}
                    alt={item.productVariant.product.name}
                    height={50}
                    width={50}
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow ml-4">
                  {/* Product Name */}
                  <p className="text-lg font-semibold">
                    {item.productVariant.product.name}
                  </p>

                  {/* Product Attributes */}
                  <p className="text-sm text-gray-600">
                    {item.productVariant.attributes &&
                      typeof item.productVariant.attributes === "object" &&
                      Object.entries(item.productVariant.attributes)
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
                    onClick={() => removeServerItemFromCart(item.id)}
                    className="mt-1 mb-1 px-2 py-1 text-xs rounded hover:text-red-500"
                  >
                    <RemoveIcon />
                  </button>
                  <QuantityInput
                    initialQuantity={item.quantity}
                    onChange={(newQuantity) =>
                      debouncedQuantityChange(item.id, newQuantity)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Subtotal: $ {serverCart?.subTotal.toFixed(2)}
            </p>
            <button
              onClick={checkout}
              className="block w-full bg-blue-500 text-white text-center py-2 mt-4 rounded-full font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
