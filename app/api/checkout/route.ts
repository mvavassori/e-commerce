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

  const prods = await stripe.products.list();

  console.log(prods);

  return NextResponse.json({ url: "" });
}
