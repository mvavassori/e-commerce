"use client";
import React from "react";
import { ProductVariant } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

interface AddToCartProps {
  selectedVariant: ProductVariant | null;
  quantity: number;
}

const AddToCart: React.FC<AddToCartProps> = ({ selectedVariant, quantity }) => {
  //todo
  const { addItemToCart, addServerItemToCart } = useCart();

  const { status } = useSession();

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    if (status === "loading") return;

    if (status === "unauthenticated") {
      addItemToCart(selectedVariant.id, quantity);
    } else if (status === "authenticated") {
      addServerItemToCart(selectedVariant.id, quantity);
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
