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
    } catch (error: any) {
        console.error("Webhook signature verification failed.", error.message);
        return NextResponse.json(
            { message: `Webhook Error: ${error.message}` },
            { status: 400 }
        );
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("session from webhook:", JSON.stringify(session, null, 2)); // lof the full session for debugging

        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        // const shippingInfo = session.shipping_details;

        const customerDetails = session.customer_details;

        if (
            userId &&
            customerDetails &&
            customerDetails.address &&
            customerDetails.name
        ) {
            const name = customerDetails.name;
            const address = customerDetails.address;
            const { city, country, line1, line2, postal_code, state } = address;

            // Check if all required fields are present
            if (city && country && line1 && postal_code && state) {
                // Check for existing shipping information
                const existingShippingInfo =
                    await db.shippingInformation.findFirst({
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
                    shippingInfoId = existingShippingInfo.id;
                } else {
                    const createdShippingInfo =
                        await db.shippingInformation.create({
                            data: {
                                userId: parseInt(userId),
                                name: name,
                                city: city,
                                country: country,
                                addressLine1: line1,
                                addressLine2: line2 || null, // potentially undefined field
                                postalCode: postal_code,
                                stateOrProvince: state,
                            },
                        });
                    shippingInfoId = createdShippingInfo.id;
                    console.log("Created new shippingInfoId:", shippingInfoId);
                }
                if (stripeCustomerId) {
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
                                stripeCustomerId: stripeCustomerId,
                            },
                        });
                    } else {
                        console.error(
                            `User with id ${userId} not found in DB.`
                        );
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
                                status: "COMPLETED",
                                total: userCart.items.reduce(
                                    (total, item) =>
                                        total + item.price * item.quantity,
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
                            {
                                message: "Order created successfully",
                                order: order,
                            },
                            { status: 200 }
                        );
                    } else {
                        // Handle the case where the cart is empty or does not exist
                        console.error(
                            `Cart for userId ${userId} is empty or not found.`
                        );
                        return NextResponse.json(
                            { message: "Cart is empty or not found" },
                            { status: 400 }
                        );
                    }
                } else {
                    // Handle the case where userId is undefined
                    return NextResponse.json(
                        {
                            message:
                                "userId or stripeCustomerId are undefined or null",
                        },
                        { status: 400 }
                    );
                }
            } else {
                console.error(
                    "Missing required fields in customer_details.address:",
                    { name, city, country, line1, postal_code, state }
                );
                return NextResponse.json(
                    { message: "Required shipping information missing" },
                    { status: 400 }
                );
            }
        } else {
            let errorMsg = "Processing error: ";
            if (!userId) errorMsg += "UserId in metadata is missing. ";
            if (!customerDetails)
                errorMsg += "Customer_details object is missing. ";
            else {
                if (!customerDetails.name)
                    errorMsg += "Customer_details.name is missing. ";
                if (!customerDetails.address)
                    errorMsg += "Customer_details.address object is missing. ";
            }
            console.error(errorMsg, { userId, customerDetails });
            return NextResponse.json(
                { message: errorMsg.trim() },
                { status: 400 }
            );
        }
    } else {
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json(
            { message: `Unhandled event type: ${event.type}` },
            { status: 200 } // Stripe expects 200 for unhandled events you don't error on
        );
    }
}
