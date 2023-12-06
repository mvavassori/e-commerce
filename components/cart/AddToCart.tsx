"use client";
import React from "react";
import { ProductVariant } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

interface AddToCartProps {
  selectedVariant: ProductVariant | null;
  quantity: number;
}

interface UnauthenticatedCartItem {
  productVariantId: number;
  quantity: number;
}

const AddToCart: React.FC<AddToCartProps> = ({ selectedVariant, quantity }) => {
  const itemsToBuy = {
    selectedVariant,
    quantity,
  };

  //todo
  const { addItemToCart } = useCart();

  const { data: session, status } = useSession();

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    // Check if user is authenticated (you'll need to implement this check)

    if (status === "authenticated") {
      // Make API call to add item to cart in database
      const response = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productVariantId: selectedVariant.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();
      // console.log(data);
    } else {
      // Add item to cart in localStorage and update cart's state
      addItemToCart(selectedVariant.id, quantity);
    }
  };

  return (
    <button
      className={`bg-blue-500 text-white py-2 px-16 rounded-full my-14 font-semibold 
              ${
                !selectedVariant
                  ? "opacity-75 cursor-not-allowed hover:bg-blue-500 active:bg-blue-500"
                  : "hover:bg-blue-600 active:bg-blue-700"
              }`}
      disabled={!selectedVariant}
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
