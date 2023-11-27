import React from "react";
import { db } from "@/lib/db";

async function getProductsVariants() {
  const products = await db.productVariant.findMany();
  return products;
}

const AllProducts = async () => {
  const products = await getProductsVariants();
  console.log(products);
  return <div>All Products</div>;
};

export default AllProducts;
