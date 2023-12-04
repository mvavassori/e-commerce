import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { productVariantIds } = body;
  try {
    const productVariants = await db.productVariant.findMany({
      where: {
        id: {
          in: productVariantIds,
        },
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
    return NextResponse.json(productVariants, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
