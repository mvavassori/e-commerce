import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "You must be logged in to perform this action." },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();
    const { productVariantId, quantity } = body;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid quantity provided." },
        { status: 400 }
      );
    }

    // Optional: Check for maximum quantity limit
    const maxQuantity = 50; // Example limit
    if (quantity > maxQuantity) {
      return NextResponse.json(
        { message: `Quantity cannot exceed ${maxQuantity}.` },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id, 10);

    let userCart = await db.cart.findUnique({
      where: { userId: userId },
      include: { items: true },
    });

    // If not, create a new cart for the user
    if (!userCart) {
      userCart = await db.cart.create({
        data: {
          userId: userId,
          // Initialize items as an empty array
        },
        include: {
          items: true, // Include items in the response
        },
      });
    }

    const existingCartItem = await db.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productVariantId: productVariantId,
      },
    });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Retrieve the product variant to get the price
      const productVariant = await db.productVariant.findUnique({
        where: { id: productVariantId },
      });

      if (!productVariant) {
        return NextResponse.json(
          { message: "Product variant not found." },
          { status: 404 }
        );
      }

      // Use the price from the database
      const price = productVariant.price;

      // Add the new item to the cart
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productVariantId: productVariantId,
          quantity: quantity,
          price: price,
        },
      });
    }

    // Retrieve the updated cart with all items
    const updatedCart = await db.cart.findUnique({
      where: { id: userCart.id },
      include: { items: true },
    });

    if (updatedCart) {
      // Calculate total price of all items in the cart
      const totalPrice = updatedCart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      return NextResponse.json(
        { cart: updatedCart, totalPrice },
        { status: 200 }
      );
    } else {
      // Handle the case where the cart is not found
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
