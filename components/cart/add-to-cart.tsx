"use client";
import React from "react";
import { ProductVariant } from "@prisma/client";

interface AddToCartProps {
  selectedVariant: ProductVariant | null;
}

const AddToCart: React.FC<AddToCartProps> = ({ selectedVariant }) => {
  //   console.log("addtocartselectedvariant", selectedVariant);
  return (
    <button
      className={`bg-blue-500 text-white py-2 px-16 rounded-full my-14 font-semibold 
              ${
                !selectedVariant
                  ? "opacity-75 cursor-not-allowed hover:bg-blue-500 active:bg-blue-500"
                  : "hover:bg-blue-600 active:bg-blue-700"
              }`}
      disabled={!selectedVariant}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
