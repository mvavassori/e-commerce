"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CloseIcon from "../icons/CloseIcon";
import CartIcon from "../icons/CartIcon";
import QuantityInput from "../QuantityInput";
import { ProductVariant, Product, ProductImage } from "@prisma/client";

interface LocalStorageCartItem {
  productVariantId: number;
  quantity: number;
}

interface FetchedItem extends ProductVariant {
  product: Product & {
    images: ProductImage[];
  };
}

interface ExtendedProductVariant extends FetchedItem {
  quantity: number;
}

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  // Array state to store the combined product variant details and quantities
  const [fetchedItems, setFecthedItems] = useState<ExtendedProductVariant[]>(
    []
  );
  // Array state to store product variant details fetched from the backend
  const [cartItems, setCartItems] = useState<ExtendedProductVariant[]>([]);

  const toggleCartMenu = () => setIsOpen(!isOpen);

  // Close the cart when the overlay is clicked
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Fetch item details when the component mounts or when localStorage changes
    const localCart: LocalStorageCartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    if (localCart.length > 0) {
      fetchItemDetails(localCart);
    }
  }, []);

  useEffect(() => {
    // Combine fetched items with localStorage quantities
    const localCart: LocalStorageCartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    const combinedCartItems = fetchedItems.map((item) => {
      const localItem = localCart.find(
        (local) => local.productVariantId === item.id
      );
      return {
        ...item,
        quantity: localItem ? localItem.quantity : 0,
      };
    });

    setCartItems(combinedCartItems);
  }, [fetchedItems]);

  const fetchItemDetails = async (localCart: LocalStorageCartItem[]) => {
    const response = await fetch("/api/item-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productVariantIds: localCart?.map((item) => item.productVariantId),
      }),
    });

    const data = await response.json();

    console.log(data);

    setFecthedItems(data);
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    // Update cartItems state
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCartItems);

    // Update localStorage
    updateLocalStorageCart(itemId, newQuantity);
  };

  const updateLocalStorageCart = (itemId: number, newQuantity: number) => {
    const localCart: LocalStorageCartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    const updatedLocalCart = localCart.map((cartItem) => {
      if (cartItem.productVariantId === itemId) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });

    localStorage.setItem("cart", JSON.stringify(updatedLocalCart));
  };

  const calculateSubtotal = () => {
    let subTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return subTotal.toFixed(2);
  };

  return (
    <div className="">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeCart}
        ></div>
      )}

      <div className="flex w-full">
        {/* Cart Modal */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-white z-20 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <button onClick={toggleCartMenu} className="absolute top-5 right-5">
            <CloseIcon />
          </button>
          {/* Cart Content */}
          <div className="p-5">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                {/* Cart Items */}
                {cartItems.map((item: ExtendedProductVariant) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
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
                    </div>
                    <QuantityInput
                      initialQuantity={item.quantity}
                      onChange={(newQuantity) =>
                        handleQuantityChange(item.id, newQuantity)
                      }
                    />
                    <p>$ {(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => console.log("Remove item")}>
                      Remove
                    </button>
                  </div>
                ))}

                {/* Cart Summary */}
                <div>
                  <p>Subtotal: $ {calculateSubtotal()}</p>
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
        </div>
      </div>
      {/* Toggle Button */}
      <button onClick={toggleCartMenu} className="">
        <CartIcon />
      </button>
    </div>
  );
}
