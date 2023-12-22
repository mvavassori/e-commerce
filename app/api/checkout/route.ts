import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET);
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// TODO Add types

const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  const availableProducts = checkProducts.data.filter(
    (product: any) => product.active === true
  );
  return availableProducts;
};

export async function POST(req: Request) {
  const authSession = await getServerSession(authOptions);
  if (!authSession || !authSession.user || !authSession.user.id) {
    return NextResponse.json(
      { message: "You must be logged in to perform this action." },
      { status: 401 }
    );
  }
  const body = await req.json();
  const { items } = body;

  let activeProducts = await getActiveProducts();

  // Create new product variants if they don't already exist on stripe.
  try {
    for (const item of items) {
      const sku = item.productVariant.sku;
      const stripeProduct = activeProducts?.find(
        (stripeProduct: any) =>
          stripeProduct?.name?.toLowerCase() == sku?.toLowerCase()
      );
      if (stripeProduct == undefined) {
        await stripe.products.create({
          name: sku,
          default_price_data: {
            unit_amount: Math.round(item.price * 100),
            currency: "usd",
          },
        });
      }
    }
  } catch (error) {
    console.error("Error in creating a new product", error);
  }

  let stripeItems: any = [];

  // Get the update active products. We don't use `let` because we want to update the variable with the new products added (if any).
  activeProducts = await getActiveProducts();

  for (const item of items) {
    const sku = item.productVariant.sku;
    const stripeProduct = activeProducts?.find(
      (prod: any) => prod?.name?.toLowerCase() == sku?.toLowerCase()
    );
    if (stripeProduct) {
      stripeItems.push({
        price: stripeProduct.default_price,
        quantity: item.quantity,
      });
    }
  }

  if (!authSession.user.email) {
    return NextResponse.json(
      { message: "User email is required for this operation." },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { email: authSession.user.email },
  });

  let stripeCustomerId = user?.stripeCustomerId;

  if (!stripeCustomerId) {
    const fullName = `${authSession.user.name} ${authSession.user.surname}`;
    const stripeCustomer = await stripe.customers.create({
      email: authSession.user.email,
      name: fullName,
    });
    stripeCustomerId = stripeCustomer.id;

    // Update your user record with the new Stripe customer ID
    await db.user.update({
      where: { email: authSession.user.email },
      data: { stripeCustomerId: stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: stripeItems,
    mode: "payment",
    success_url: "http://localhost:3000/success", // `${process.env.SITE_URL}/success`
    cancel_url: "http://localhost:3000/cancel", // `${process.env.SITE_URL}/cancel`
    shipping_address_collection: {
      allowed_countries: ["US", "IT"],
    },
    metadata: {
      userId: authSession.user.id.toString(),
    },
  });

  return NextResponse.json({ url: session.url });
}
