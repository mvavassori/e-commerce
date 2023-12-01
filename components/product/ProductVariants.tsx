"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ProductVariant } from "@prisma/client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AddToCart from "../cart/AddToCartButton";

interface ProductVariantProps {
  variants: ProductVariant[];
  basePrice: number;
}

interface ProductAttribute {
  [key: string]: string;
}

const ProductVariants: React.FC<ProductVariantProps> = ({
  variants,
  basePrice,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  //state variables
  const [selectedAttributes, setSelectedAttributes] =
    useState<ProductAttribute>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  // In summary, this code collects all unique values for each attribute across all product variants. For example, if you have t-shirts in different sizes and colors, it will create a list of all available sizes and another list of all available colors, without any duplicates.
  const uniqueAttributes = useMemo(() => {
    const attributesMap = new Map<string, Set<string>>();
    variants.forEach((productVariant) => {
      const attributes = productVariant.attributes as ProductAttribute;
      if (typeof attributes === "object" && attributes !== null) {
        Object.entries(attributes).forEach(([key, value]) => {
          if (!attributesMap.has(key)) {
            attributesMap.set(key, new Set());
          }
          attributesMap.get(key)?.add(value);
        });
      }
    });
    return attributesMap;
  }, [variants]);

  useEffect(() => {
    // Ensure there are selected attributes
    if (Object.keys(selectedAttributes).length > 0) {
      // Check if all necessary attributes are selected
      const allAttributesSelected = Array.from(uniqueAttributes.keys()).every(
        (key) => selectedAttributes[key]
      );

      if (allAttributesSelected) {
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
      } else {
        // Reset selectedVariant if not all attributes are selected
        setSelectedVariant(null);
      }
    } else {
      // Reset selectedVariant if no attributes are selected
      setSelectedVariant(null);
    }
  }, [selectedAttributes, variants, uniqueAttributes]);

  useEffect(() => {
    // Check if router is ready and has query parameters
    if (searchParams) {
      const initialAttributes: ProductAttribute = {};
      // Iterate over the URLSearchParams
      const queryParams = new URLSearchParams(
        Array.from(searchParams.entries())
      );
      queryParams.forEach((value, key) => {
        if (uniqueAttributes.has(key)) {
          // Check if the key is known
          initialAttributes[key] = value;
        }
      });

      // Update state with the initial attributes from the URL
      setSelectedAttributes(initialAttributes);
    }
  }, [searchParams]);

  const handleButtonClick = (attributeName: string, value: string) => {
    // now you got a read/write object
    const queryParams = new URLSearchParams(Array.from(searchParams.entries()));

    queryParams.set(attributeName, value);

    // cast to string
    const attributes = queryParams.toString();
    // or const query = `${"?".repeat(search.length && 1)}${search}`;
    const query = attributes ? `?${attributes}` : "";

    router.push(`${pathname}${query}`, { scroll: false });

    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  return (
    <>
      <p className="font-semibold text-lg mt-4">
        $ {selectedVariant?.price || basePrice}
      </p>
      {/* In summary, this code dynamically generates sections for each unique product attribute (like "Size" or "Color"), and under each section, it generates buttons for each attribute value (like "XS", "S", "M" for size).  */}
      {Array.from(uniqueAttributes).map(([attributeName, values]) => (
        <div key={attributeName}>
          <p className="font-semibold mt-6">{attributeName.toUpperCase()}</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              // Determine if this value is selected
              const isSelected = selectedAttributes[attributeName] === value;

              // Conditional class
              const buttonClass = isSelected
                ? "border-3 border-gray-400 ring-blue-400 ring-2 bg-blue-200 px-2 rounded-full mt-3"
                : "border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3";

              return (
                <button
                  key={value}
                  className={buttonClass}
                  onClick={() => handleButtonClick(attributeName, value)}
                >
                  {value.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <AddToCart selectedVariant={selectedVariant} />
    </>
  );
};

export default ProductVariants;
