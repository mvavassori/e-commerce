import Image from "next/image";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

// export const dynamicParams = false;

interface ProductAttribute {
  [key: string]: string;
}

export async function generateStaticParams() {
  const products = await db.product.findMany();
  // console.log(product);
  return products.map((product) => ({
    sku: product.sku,
  }));
}

export default async function ProductPage({
  params: { productSku },
}: {
  params: { productSku: string };
}) {
  const productWithVariants = await db.product.findUnique({
    where: {
      sku: productSku,
    },
    include: {
      variants: true, // Include all related variants
    },
  });
  if (!productWithVariants) {
    return notFound();
  }

  // Extract unique attributes
  const uniqueAttributes = new Map<string, Set<string>>();

  productWithVariants.variants.forEach((product) => {
    const attributes = product.attributes as ProductAttribute;
    if (typeof attributes === "object" && attributes !== null) {
      Object.entries(attributes).forEach(([key, value]) => {
        if (!uniqueAttributes.has(key)) {
          uniqueAttributes.set(key, new Set());
        }
        uniqueAttributes.get(key)?.add(value);
      });
    }
  });

  // console.log(productWithVariants.variants);
  console.log(uniqueAttributes);

  return (
    <div className="md:flex px-4 sm:px-6 lg:px-20 mt-10 mb-12">
      <div className="w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="product"
          width={500}
          height={500}
          className="object-contain mx-auto"
        />
        <div className="flex flex-wrap gap-6 mt-16 mb-12 justify-center">
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product"
            width={500}
            height={500}
            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
          />
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product"
            width={500}
            height={500}
            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
          />
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product"
            width={500}
            height={500}
            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
          />
        </div>
      </div>
      <div className="md:w-2/5">
        <h1 className="text-3xl md:text-5xl font-bold">
          {productWithVariants?.name}
        </h1>
        <p className="font-semibold text-lg mt-4">
          $ {productWithVariants?.price}
        </p>
        <div>
          {Array.from(uniqueAttributes).map(([attributeName, values]) => (
            <div key={attributeName}>
              <p className="font-semibold mt-6">
                {attributeName.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(values).map((value) => (
                  <button
                    key={value}
                    className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3"
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* <p className="font-semibold mt-6">Size</p>
        <div className="flex flex-wrap gap-2">
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            XS
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            S
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            M
          </button>
        </div>
        <p className="font-semibold mt-6">Color</p>
        <div className="flex flex-wrap gap-2">
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            White
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            Black
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            Blue
          </button>
        </div> */}
        <div>
          <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2 px-16 rounded-full my-14 font-semibold">
            Add to Cart
          </button>
        </div>
        <p className="text-sm">{productWithVariants?.description}</p>
      </div>
    </div>
  );
}
