import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

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
      shippingInfo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

const DashboardOrders = async () => {
  const orders = await getOrders();
  return (
    <div className="bg-gray-100 mt-6 rounded-lg p-4">
      <h2 className="font-bold text-3xl">Orders</h2>
      <div className="mt-4">
        {/* ...other user dashboard content... */}

        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="mb-4">
              <h3 className="font-bold">
                Order #{order.id} - Status: {order.status}
              </h3>
              <div className="md:flex gap-x-2 text-xs">
                <div className="flex gap-x-1">
                  <p className="font-semibold">Date: </p>
                  <p className=" text-gray-700">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <div className="sm:flex gap-x-1">
                  <p className="font-semibold">Shipping to:</p>
                  <p>{order.shippingInfo?.name}</p>
                  <p>{order.shippingInfo?.addressLine1}</p>
                  {order.shippingInfo?.addressLine2 && (
                    <p>{order.shippingInfo?.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingInfo?.city},{" "}
                    {order.shippingInfo?.stateOrProvince}
                  </p>
                  <p>{order.shippingInfo?.country}</p>
                  <p>{order.shippingInfo?.postalCode}</p>
                </div>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="">
                  <Link href={`/product/${item.productVariant?.product.sku}`}>
                    <div className="flex items-center border rounded-md p-2">
                      <Image
                        src={
                          item.productVariant?.product.images[0].url ||
                          "https://iskaknozihhuhqaiqtlj.supabase.co/storage/v1/object/public/e-commerce%20images/no-image.png?t=2023-12-19T13%3A41%3A15.217Z"
                        }
                        alt={
                          item.productVariant?.product.name ||
                          "Default Product Name"
                        }
                        width={100}
                        height={100}
                        className="w-20 h-20 object-cover mr-4 rounded-md"
                      />
                      <div className="text-sm">
                        <p>Product: {item.productVariant?.product.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                        <p className="">
                          Attributes:{" "}
                          {item.productVariant?.attributes &&
                            typeof item.productVariant.attributes ===
                              "object" &&
                            Object.entries(item.productVariant.attributes)
                              .map(([attributeKey, attributeValue]) =>
                                attributeValue?.toString()
                              )
                              .join(" / ")}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-lg font-semibold text-gray-700">
            We haven&apos;t received any orders yet...
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;
