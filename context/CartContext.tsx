"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  ProductVariant,
  Product,
  ProductImage,
  Cart,
  CartItem,
} from "@prisma/client";
import { useSession } from "next-auth/react";

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

interface ExtendedCartItem extends CartItem {
  productVariant: FetchedItem;
}

interface FetchedCart {
  cart: Cart & {
    items: ExtendedCartItem[];
  };
  subTotal: number;
}

interface CartContextType {
  cartItems: ExtendedProductVariant[];
  addItemToCart: (newItemId: number, quantity: number) => void;
  handleQuantityChange: (itemId: number, quantity: number) => void;
  fetchItemDetails: (localCart: LocalStorageCartItem[]) => void;
  subTotal: number;
  removeItemFromCart: (itemId: number) => void;
  serverCart: FetchedCart | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Array state to store the combined product variant details and quantities
  const [fetchedItems, setFecthedItems] = useState<FetchedItem[]>([]);
  // Array state to store product variant details fetched from the backend
  const [cartItems, setCartItems] = useState<ExtendedProductVariant[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0);

  const [serverCart, setServerCart] = useState<FetchedCart | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      // Fetch item details when the component mounts or when localStorage changes
      const localCart: LocalStorageCartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      if (localCart.length > 0) {
        fetchItemDetails(localCart);
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
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
    } else if (status === "authenticated") {
      fetchCart();
    }
  }, [fetchedItems, status]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      if (cartItems) {
        calculateSubtotal();
      }
    }
  }, [cartItems, status]);

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

    // console.log(data);

    setFecthedItems(data);
  };

  const fetchCart = async () => {
    const response = await fetch("/api/cart");
    const data = await response.json();

    console.log(data);
    setServerCart(data);
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
    let subTotalCalc = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setSubTotal(subTotalCalc);
  };

  // Add a new item to the cart
  const addItemToCart = async (newItemId: number, quantity: number) => {
    // Add item to cart in localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newCartItem = {
      productVariantId: newItemId,
      quantity: quantity,
    };

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (item: LocalStorageCartItem) => item.productVariantId == newItemId
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += quantity;
      setCartItems((currentItems) => {
        return currentItems.map((item) => {
          if (item.id === newItemId) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      });
    } else {
      // Add new item to cart
      cart.push(newCartItem);
    }

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Fetch details for the updated cart
    await fetchItemDetails(cart);
  };

  const removeItemFromCart = (itemId: number) => {
    // Retrieve the current cart from local storage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Filter out the item to be removed
    const updatedCart = cart.filter(
      (item: LocalStorageCartItem) => item.productVariantId !== itemId
    );

    // Update local storage with the new cart
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Update the cartItems state to reflect the removal
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  return (
    <CartContext.Provider
      value={{
        serverCart,
        cartItems,
        addItemToCart,
        handleQuantityChange,
        fetchItemDetails,
        subTotal,
        removeItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
