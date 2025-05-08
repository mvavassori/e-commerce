import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductVariants from "@/components/product/ProductVariants";
import ProductImages from "@/components/product/ProductImages";

interface ProductAttribute {
    [key: string]: string;
}

export const dynamic = "force-static"; // added to solve the 500 internal server error

// SEO Optimization
export async function generateMetadata({
    params,
}: {
    params: { productSku: string };
}) {
    try {
        const product = await db.product.findUnique({
            where: {
                sku: params.productSku,
            },
        });
        if (!product) {
            return {
                title: "Not found",
                description: "The Product you're looking for doesn't exist.",
            };
        }
        return {
            title: product.name,
            description: product.description,
            alternates: {
                canonical: `/product/${product.sku}`,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            title: "Not found",
            description: "The Product you're looking for doesn't exist.",
        };
    }
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
            variants: true,
            images: true,
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

    return (
        <div className="md:flex px-4 sm:px-6 lg:px-20 mt-10 mb-12">
            <ProductImages
                images={productWithVariants?.images}
                productName={productWithVariants?.name}
            />
            <div className="md:w-2/5">
                <h1 className="text-3xl md:text-5xl font-bold">
                    {productWithVariants?.name}
                </h1>
                <ProductVariants
                    variants={productWithVariants?.variants}
                    basePrice={productWithVariants?.price}
                />
                <p className="text-sm">{productWithVariants?.description}</p>
            </div>
        </div>
    );
}
