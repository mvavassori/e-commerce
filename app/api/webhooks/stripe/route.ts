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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("session", session);

    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer;
    const shippingInfo = session.shipping_details;

    if (userId && shippingInfo && shippingInfo.address) {
      const { name, address } = shippingInfo;
      const { city, country, line1, line2, postal_code, state } = address;

      // Check if all required fields are present
      if (name && city && country && line1 && postal_code && state) {
        // Check for existing shipping information
        const existingShippingInfo = await db.shippingInformation.findFirst({
          where: {
            userId: parseInt(userId),
            name: name,
            city: city,
            country: country,
            addressLine1: line1,
            addressLine2: line2 || null,
            postalCode: postal_code,
            stateOrProvince: state,
          },
        });

        let shippingInfoId;
        if (existingShippingInfo) {
          // Use existing shipping information
          shippingInfoId = existingShippingInfo.id;
        } else {
          // Create new shipping information
          const createdShippingInfo = await db.shippingInformation.create({
            data: {
              userId: parseInt(userId),
              name: name,
              city: city,
              country: country,
              addressLine1: line1,
              addressLine2: line2 || null, // Handle potentially undefined fields
              postalCode: postal_code,
              stateOrProvince: state,
            },
          });
          shippingInfoId = createdShippingInfo.id;
        }
        // Check if userId is defined
        if (userId && stripeCustomerId) {
          const user = await db.user.findUnique({
            where: {
              id: parseInt(userId),
            },
          });

          if (user) {
            await db.user.update({
              where: {
                id: user.id,
              },
              data: {
                stripeCustomerId: stripeCustomerId?.toString(),
              },
            });
          }

          const userCart = await db.cart.findUnique({
            where: { userId: parseInt(userId) },
            include: { items: true },
          });

          if (userCart && userCart.items.length > 0) {
            // Proceed to create Order and OrderItems
            const order = await db.order.create({
              data: {
                userId: parseInt(userId),
                status: "COMPLETED", // Or your desired initial status
                total: userCart.items.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ),
                shippingInfoId: shippingInfoId,
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
            { message: "userId or stripeCustomerId are undefined or null" },
            { status: 400 }
          );
        }
      } else {
        console.error("Missing required shipping information");

        return NextResponse.json(
          { message: "Required shipping information missing" },
          { status: 400 }
        );
      }
    } else {
      console.error("UserId or shipping details are missing");

      return NextResponse.json(
        { message: "userId or shipping details are missing" },
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
