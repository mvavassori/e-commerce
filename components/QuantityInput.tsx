"use client";
import React, { useState, useEffect } from "react";

type QuantityInputProps = {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onChange?: (quantity: number) => void;
};

const QuantityInput: React.FC<QuantityInputProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 50,
  onChange,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  return (
    <div className="flex items-center mt-12">
      <button
        className="px-3 bg-gray-200 text-black rounded-l-md border-t border-b active:bg-gray-300"
        onClick={handleDecrease}
      >
        -
      </button>
      <input
        type="text"
        className="w-12 text-center border-t border-b"
        value={quantity}
        readOnly
      />
      <button
        className="px-3 bg-gray-200 text-black rounded-r-md border-t border-b active:bg-gray-300"
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;
