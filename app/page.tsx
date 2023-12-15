import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

async function getProducts() {
  const products = await db.product.findMany({
    include: {
      images: true,
      category: true,
    },
  });
  return products;
}

const Home = async () => {
  const products = await getProducts();
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-200 text-center py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to Our Store!
          </h1>
          <p className="text-gray-600 mt-4">
            Find the best products for your needs
          </p>
          <Link href="/all-products">
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Featured Products
          </h2>
          {/* Products grid */}
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
      </section>
    </main>
  );
};

export default Home;
