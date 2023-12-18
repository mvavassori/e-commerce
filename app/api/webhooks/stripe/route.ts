import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") ?? "";
  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_TEST_WEBHOOK_SECRET || ""
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "payment_intent.succeeded") {
    const userId = session?.metadata?.userId;
    const stripeCustomerId = session.customer;

    console.log("userId", userId);
    console.log("stripeCustomerId", stripeCustomerId);

    // Check if userId is defined
    if (userId) {
      const user = await db.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });
      console.log("user", user);

      if (user) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeCustomerId: stripeCustomerId?.toString(),
          },
        });
        console.log("User updated with stripeCustomerId");
      }

      //   return NextResponse.json({ message: "Success" }, { status: 200 });
      const userCart = await db.cart.findUnique({
        where: { userId: parseInt(userId) },
        include: { items: true },
      });

      if (userCart && userCart.items.length > 0) {
        console.log("userCart", userCart);
        // Proceed to create Order and OrderItems
        const order = await db.order.create({
          data: {
            userId: parseInt(userId),
            status: "COMPLETED", // Or your desired initial status
            total: userCart.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            ),
            items: {
              create: userCart.items.map((item) => ({
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        await db.cartItem.deleteMany({
          where: { cartId: userCart.id },
        });
        // Return success response after order creation
        return NextResponse.json(
          { message: "Order created successfully", order: order },
          { status: 200 }
        );
      } else {
        // Handle the case where the cart is empty or does not exist
        return NextResponse.json(
          { message: "Cart is empty or not found" },
          { status: 400 }
        );
      }
    } else {
      // Handle the case where userId is undefined
      return NextResponse.json(
        { message: "UserId is undefined" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { message: `Unhandled event type: ${event.type}` },
      { status: 200 }
    );
  }
}
