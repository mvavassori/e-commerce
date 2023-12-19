import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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
      <div>
        <p>my order 1</p>
        <p>my order 2</p>
      </div>
    </div>
  );
};

export default DashboardOrders;
