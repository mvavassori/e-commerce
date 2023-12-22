import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AllProductsSidebar from "@/components/AllProductsSidebar";

export async function generateStaticParams() {
  const products = await db.product.findMany({
    include: {
      category: true,
    },
  });
  return products.map((product) => ({
    categoryName: product.category.name,
  }));
}

export default async function AllCategoryProducts({
  params: { categoryName },
}: {
  params: { categoryName: string };
}) {
  const productCategory = await db.product.findMany({
    where: {
      category: {
        name: categoryName,
      },
    },
    include: {
      category: true,
      images: true,
    },
  });
  if (!productCategory) {
    return notFound();
  }
  return (
    <div className="md:flex px-6">
      <div className="md:w-1/4 mt-6">
        <AllProductsSidebar />
      </div>
      <div className="md:grid sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 mt-6 ml-6">
        {productCategory.map((product) => (
          <div key={product.id} className="border rounded-md py-2 px-4">
            <Link href={`/product/${product.sku}`}>
              <Image
                src={product.images[0].url}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-md"
              />
              {/*todo make the price not go too far to the left on smaller screens*/}
              <div className="flex justify-between mt-3">
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
}
