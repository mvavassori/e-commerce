import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  const availableProducts = checkProducts.data.filter(
    (product: any) => product.active === true
  );
  return availableProducts;
};

export async function POST(req: Request) {
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

  const session = await stripe.checkout.sessions.create({
    line_items: stripeItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  // const prods = await stripe.products.list();

  // console.log(prods);

  return NextResponse.json({ url: session.url });
}
