import { Category } from "@prisma/client";
import Link from "next/link";
import { db } from "@/lib/db";

async function getCategories() {
  const categories = await db.category.findMany();
  return categories;
}

const AllProductsSidebar = async () => {
  const categories = await getCategories();
  return (
    <>
      <p className="text-xs text-gray-700 font-semibold mb-4">Categories</p>
      <Link href="/all-products" className="hover:font-semibold">
        All
      </Link>
      {categories.map((category) => (
        <div key={category.id} className="pt-1">
          <Link
            href={`/all-products/${category.name}`}
            className="hover:font-semibold"
          >
            {category.name}
          </Link>
        </div>
      ))}
    </>
  );
};

export default AllProductsSidebar;
