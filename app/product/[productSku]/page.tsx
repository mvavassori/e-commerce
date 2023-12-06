import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductVariants from "@/components/product/ProductVariants";
import ProductImages from "@/components/product/ProductImages";

interface ProductAttribute {
  [key: string]: string;
}

export async function generateStaticParams() {
  const products = await db.product.findMany();
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
      images: true, // Include all related images
    },
  });
  if (!productWithVariants) {
    return notFound();
  }

  // In summary, this code collects all unique values for each attribute across all product variants. For example, if you have t-shirts in different sizes and colors, it will create a list of all available sizes and another list of all available colors, without any duplicates.
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
  // console.log(uniqueAttributes);
  // console.log(productWithVariants.images);

  return (
    <div className="md:flex px-4 sm:px-6 lg:px-20 mt-10 mb-12">
      <ProductImages
        images={productWithVariants?.images}
        productName={productWithVariants?.name}
      />
      {/* <div className="w-full h-full">
        <Image
          src={productWithVariants.images[0].url}
          alt="product"
          width={500}
          height={500}
          className="object-contain mx-auto"
        />
        <div className="flex flex-wrap gap-6 mt-16 mb-12 justify-center">
          {productWithVariants.images.length > 1 &&
            productWithVariants.images.map((image: ProductImage) => (
              <Image
                key={image.id}
                src={image.url}
                alt={productWithVariants.name + "image"}
                width={500}
                height={500}
                className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
              />
            ))}
        </div>
      </div> */}
      <div className="md:w-2/5">
        <h1 className="text-3xl md:text-5xl font-bold">
          {productWithVariants?.name}
        </h1>
        {/* <p className="font-semibold text-lg mt-4">
          $ {productWithVariants?.price}
        </p> */}
        <ProductVariants
          variants={productWithVariants?.variants}
          basePrice={productWithVariants?.price}
        />
        <p className="text-sm">{productWithVariants?.description}</p>
      </div>
    </div>
  );
}
