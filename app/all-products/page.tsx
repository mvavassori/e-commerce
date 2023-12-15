// import React from "react";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import AllProductsSidebar from "@/components/AllProductsSidebar";

async function getProducts() {
  const products = await db.product.findMany({
    take: 3, // Fetch only the first 3 products
    include: {
      images: true,
    },
  });
  return products;
}

const AllProducts = async () => {
  const products = await getProducts();
  return (
    <div className="md:flex px-6">
      <div className="md:w-1/5 mt-6">
        <AllProductsSidebar />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-md py-2 px-4 flex flex-col items-center"
          >
            <Link href={`/product/${product.sku}`}>
              <div className="flex justify-center w-full">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="rounded-md"
                />
              </div>
              <div className="flex justify-between mt-3 w-full">
                <p className="font-semibold">{product.name}</p>
                <p className="font-semibold text-[15px]">
                  $ {product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
