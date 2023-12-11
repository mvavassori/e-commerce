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

    // // Retrieve the updated cart with all items
    // const updatedCart = await db.cart.findUnique({
    //   where: { id: userCart.id },
    //   include: { items: true },
    // });

    // Retrieve the updated cart with all items, including nested properties
    const updatedCart = await db.cart.findUnique({
      where: { id: userCart.id },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (updatedCart) {
      // Calculate total price of all items in the cart
      const subTotal = updatedCart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      return NextResponse.json(
        { cart: updatedCart, subTotal },
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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "You must be logged in to perform this action." },
      { status: 401 }
    );
  }
  try {
    const userId = parseInt(session.user.id, 10);

    let userCart = await db.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // If not, create a new cart for the user
    if (!userCart) {
      userCart = await db.cart.create({
        data: {
          userId: userId,
        },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
    // Calculate total price of all items in the cart
    const subTotal = userCart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    return NextResponse.json({ cart: userCart, subTotal });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "You must be logged in to perform this action." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { cartItemId, newQuantity } = body;
    const userId = parseInt(session.user.id, 10);

    // Validate quantity
    if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
      return NextResponse.json(
        { message: "Invalid quantity provided." },
        { status: 400 }
      );
    }

    // Optional: Check for maximum quantity limit
    const maxQuantity = 50; // Example limit
    if (newQuantity > maxQuantity) {
      return NextResponse.json(
        { message: `Quantity cannot exceed ${maxQuantity}.` },
        { status: 400 }
      );
    }

    // Find the cart item to ensure it belongs to the user's cart
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: userId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    // Update the quantity of the existing cart item
    const updatedCartItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
      include: { cart: true },
    });

    if (updatedCartItem) {
      // Retrieve the updated cart with all items, including nested properties
      const updatedCart = await db.cart.findUnique({
        where: { id: updatedCartItem.cartId },
        include: {
          items: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (updatedCart) {
        // Calculate total price of all items in the cart
        const subTotal = updatedCart.items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);

        return NextResponse.json(
          { cart: updatedCart, subTotal },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "You must be logged in to perform this action." },
      { status: 401 }
    );
  }

  try {
    const userId = parseInt(session.user.id, 10);
    const body = await req.json();
    const { cartItemId } = body;

    if (!cartItemId || typeof cartItemId !== "number") {
      return NextResponse.json(
        { message: "Invalid cart item ID." },
        { status: 400 }
      );
    }

    // Find the cart item to ensure it belongs to the user's cart
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: userId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    // Delete the cart item
    await db.cartItem.delete({ where: { id: cartItemId } });

    // Fetch and return the updated cart
    const updatedCart = await db.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (updatedCart) {
      // Calculate total price of all items in the cart
      const subTotal = updatedCart.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      return NextResponse.json(
        { cart: updatedCart, subTotal },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
