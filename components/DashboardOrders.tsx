import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

const getOrders = async () => {
  const session = await getServerSession(authOptions);
  const orders = await db.order.findMany({
    where: {
      userId: parseInt(session!.user.id, 10),
    },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  images: true, // Include images of the product
                },
              },
            },
          },
        },
      },
    },
  });
  return orders;
};

const DashboardOrders = async () => {
  const orders = await getOrders();
  console.log(orders);
  return (
    <div className="bg-gray-100 mt-6 rounded-lg p-4">
      <h2 className="font-bold text-3xl">Orders</h2>
      <div className="mt-4">
        {/* ...other user dashboard content... */}
        {orders.map((order) => (
          <div key={order.id} className="mb-4">
            <h3 className="font-bold">
              Order #{order.id} - Status: {order.status}
            </h3>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center border rounded-md p-2"
              >
                <Image
                  src={
                    item.productVariant?.product.images[0].url ||
                    "https://iskaknozihhuhqaiqtlj.supabase.co/storage/v1/object/public/e-commerce%20images/no-image.png?t=2023-12-19T13%3A41%3A15.217Z"
                  }
                  alt={
                    item.productVariant?.product.name || "Default Product Name"
                  }
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover mr-4 rounded-md"
                />
                <div>
                  <p>Product: {item.productVariant?.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price}</p>
                  <p className="">
                    Attributes:{" "}
                    {item.productVariant?.attributes &&
                      typeof item.productVariant.attributes === "object" &&
                      Object.entries(item.productVariant.attributes)
                        .map(([attributeKey, attributeValue]) =>
                          attributeValue?.toString()
                        )
                        .join(" / ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOrders;
