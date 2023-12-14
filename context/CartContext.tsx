"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
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
  handleServerQuantityChange: (itemId: number, quantity: number) => void;
  removeServerItemFromCart: (itemId: number) => void;
  addServerItemToCart: (newItemId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fetchedItems, setFecthedItems] = useState<FetchedItem[]>([]);
  const [cartItems, setCartItems] = useState<ExtendedProductVariant[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [serverCart, setServerCart] = useState<FetchedCart | null>(null);

  const prevStatusRef = useRef<
    "authenticated" | "loading" | "unauthenticated" | null
  >(null);

  const { status } = useSession();

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
    const calculateSubtotal = () => {
      let subTotalCalc = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setSubTotal(subTotalCalc);
    };
    if (status === "loading") return;
    if (status === "unauthenticated") {
      if (cartItems) {
        calculateSubtotal();
      }
    }
  }, [cartItems, status]);

  useEffect(() => {
    prevStatusRef.current = status;
  }, [status]);

  useEffect(() => {
    const mergeCarts = async () => {
      try {
        const localCart: LocalStorageCartItem[] = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        if (localCart.length > 0) {
          const operations = localCart.map(async (item) => {
            const existingItem = serverCart?.cart.items.find(
              (ci) => ci.productVariant.id === item.productVariantId
            );

            if (existingItem) {
              return handleServerQuantityChange(
                existingItem.id,
                existingItem.quantity + item.quantity
              );
            } else {
              return addServerItemToCart(item.productVariantId, item.quantity);
            }
          });
          // Wait for all operations to complete
          await Promise.all(operations);
        }
        localStorage.setItem("cart", JSON.stringify([]));
      } catch (error) {
        console.error("Error merging carts: ", error);
      }
    };
    // isLoggingIn i setted to true on signIn inside the signInForm.tsx component
    const isLoggingIn = sessionStorage.getItem("isLoggingIn");
    if (isLoggingIn === "true" && status === "authenticated") {
      mergeCarts();
    }
    // Clear the flag after checking
    sessionStorage.removeItem("isLoggingIn");
  }, [status, serverCart]);

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

    setFecthedItems(data);
  };

  const fetchCart = async () => {
    const response = await fetch("/api/cart");
    const data = await response.json();

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

  const handleServerQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId, newQuantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart item quantity");
      }

      const updatedCart = await response.json();

      // Update the serverCart state with the new cart data
      setServerCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
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

  const addServerItemToCart = async (
    productVariantId: number,
    quantity: number
  ) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productVariantId: productVariantId,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      setServerCart(data);
    } catch (error) {
      console.error("Error adding cart item:", error);
    }
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

  const removeServerItemFromCart = async (cartItemId: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId: cartItemId }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove cart item");
      }
      const updatedCart = await response.json();
      setServerCart(updatedCart);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
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
        handleServerQuantityChange,
        removeServerItemFromCart,
        addServerItemToCart,
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
