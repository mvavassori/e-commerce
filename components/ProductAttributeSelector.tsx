"use client";
import React, { useState, useEffect } from "react";
import { ProductVariant } from "@prisma/client";

interface AttributeSelectorProps {
  variants: ProductVariant[];
}

interface ProductAttribute {
  [key: string]: string;
}

const ProductAttributeSelector: React.FC<AttributeSelectorProps> = ({
  variants,
}) => {
  //state variables
  const [selectedAttributes, setSelectedAttributes] =
    useState<ProductAttribute>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const handleButtonClick = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  useEffect(() => {
    console.log("Selected Attributes:", selectedAttributes);
  }, [selectedAttributes]);

  useEffect(() => {
    const foundVariant = variants.find((variant) => {
      const attributes = variant.attributes as ProductAttribute;
      if (typeof attributes === "object" && attributes !== null) {
        return Object.entries(selectedAttributes).every(
          ([key, value]) => attributes[key] === value
        );
      }
      return false;
    });

    setSelectedVariant(foundVariant ?? null);
  }, [selectedAttributes, variants]);

  // In summary, this code collects all unique values for each attribute across all product variants. For example, if you have t-shirts in different sizes and colors, it will create a list of all available sizes and another list of all available colors, without any duplicates.
  const uniqueAttributes = new Map<string, Set<string>>();

  variants.forEach((productVariant) => {
    const attributes = productVariant.attributes as ProductAttribute;
    if (typeof attributes === "object" && attributes !== null) {
      Object.entries(attributes).forEach(([key, value]) => {
        if (!uniqueAttributes.has(key)) {
          uniqueAttributes.set(key, new Set());
        }
        uniqueAttributes.get(key)?.add(value);
      });
    }
  });

  return (
    <div>
      {/* In summary, this code dynamically generates sections for each unique product attribute (like "Size" or "Color"), and under each section, it generates buttons for each attribute value (like "XS", "S", "M" for size).  */}
      {Array.from(uniqueAttributes).map(([attributeName, values]) => (
        <div key={attributeName}>
          <p className="font-semibold mt-6">{attributeName.toUpperCase()}</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => (
              <button
                key={value}
                className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3"
                onClick={() => handleButtonClick(attributeName, value)}
              >
                {/* {value.charAt(0).toUpperCase() + value.slice(1)} */}
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductAttributeSelector;
