// prisma/seed.ts
import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // Clean up existing data (optional, but good for repeatable seeds)
    // Order matters due to foreign key constraints! Delete children before parents.
    console.log("Deleting existing data...");
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.shippingInformation.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.user.deleteMany({}); // Keep this if you want to seed users too, or remove if not.
    console.log("Existing data deleted.");

    // --- Create Users (Optional, but useful for testing carts/orders) ---
    // For simplicity, I'll skip creating users, carts, and orders for now,
    // focusing on products. You can extend this later.
    // Example User:
    // const user1 = await prisma.user.create({
    //   data: {
    //     email: 'alice@example.com',
    //     name: 'Alice',
    //     surname: 'Smith',
    //     password: 'hashedpassword', // Remember to hash passwords in a real app!
    //     birthDate: new Date('1990-01-01T00:00:00.000Z'),
    //     gender: Gender.FEMALE,
    //   },
    // });
    // console.log(`Created user with id: ${user1.id}`);

    // --- Create Categories ---
    console.log("Creating categories...");
    const electronics = await prisma.category.create({
        data: {
            name: "Electronics",
            description:
                "Gadgets and devices to make your life easier and more fun.",
        },
    });

    const clothing = await prisma.category.create({
        data: {
            name: "Apparel",
            description: "Stylish and comfortable clothing for all occasions.",
        },
    });

    const books = await prisma.category.create({
        data: {
            name: "Books",
            description:
                "Expand your knowledge and imagination with our collection of books.",
        },
    });
    console.log(
        `Created categories: ${electronics.name}, ${clothing.name}, ${books.name}`
    );

    // --- Create Products with Variants and Images ---
    console.log("Creating products...");

    // Product 1: Laptop (Electronics)
    const laptop = await prisma.product.create({
        data: {
            name: "UltraBook Pro X1",
            description:
                "A powerful and sleek ultrabook for professionals and creatives. Lightweight design with cutting-edge performance.",
            sku: "UBPX1-BASE", // Base product SKU
            price: 1200.0, // Base price (can be overridden by variants)
            categoryId: electronics.id,
            images: {
                create: [
                    {
                        url: "https://placehold.co/600x400.png?text=Laptop+Front&bg=EFEFEF&fc=AAAAAA",
                    },
                    {
                        url: "https://placehold.co/600x400.png?text=Laptop+Side&bg=CCCCCC&fc=333333",
                    },
                    {
                        url: "https://placehold.co/600x400.png?text=Laptop+Open&bg=DDDDDD&fc=555555",
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: "UBPX1-I5-8GB-256SSD",
                        price: 1299.99,
                        inventory: 50,
                        attributes: {
                            processor: "Core i5",
                            ram: "8GB",
                            storage: "256GB SSD",
                            color: "Silver",
                        },
                    },
                    {
                        sku: "UBPX1-I7-16GB-512SSD",
                        price: 1599.99,
                        inventory: 30,
                        attributes: {
                            processor: "Core i7",
                            ram: "16GB",
                            storage: "512GB SSD",
                            color: "Space Gray",
                        },
                    },
                ],
            },
        },
    });
    console.log(`Created product: ${laptop.name}`);

    // Product 2: T-Shirt (Clothing)
    const tShirt = await prisma.product.create({
        data: {
            name: "Classic Cotton T-Shirt",
            description:
                "A comfortable and durable 100% cotton t-shirt, perfect for everyday wear.",
            sku: "CCT-BASE",
            price: 20.0,
            categoryId: clothing.id,
            images: {
                create: [
                    {
                        url: "https://placehold.co/600x400.png?text=T-Shirt+Front&bg=F0F0F0&fc=999999",
                    },
                    {
                        url: "https://placehold.co/600x400.png?text=T-Shirt+Model&bg=E0E0E0&fc=777777",
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: "CCT-BLK-M",
                        price: 25.0,
                        inventory: 100,
                        attributes: { color: "Black", size: "M" },
                    },
                    {
                        sku: "CCT-WHT-L",
                        price: 25.0,
                        inventory: 80,
                        attributes: { color: "White", size: "L" },
                    },
                    {
                        sku: "CCT-BLU-S",
                        price: 24.5,
                        inventory: 60,
                        attributes: { color: "Navy Blue", size: "S" },
                    },
                ],
            },
        },
    });
    console.log(`Created product: ${tShirt.name}`);

    // Product 3: Sci-Fi Novel (Books)
    const sciFiNovel = await prisma.product.create({
        data: {
            name: "Galaxy Wanderers",
            description:
                "An epic science fiction adventure across the stars. Follow the crew of the Starship Voyager.",
            sku: "GWNVL-BASE",
            price: 15.0,
            categoryId: books.id,
            images: {
                create: [
                    {
                        url: "https://placehold.co/600x400.png?text=Book+Cover&bg=AACCFF&fc=113355",
                    },
                ],
            },
            variants: {
                // Books might not always have variants, but let's add one for format
                create: [
                    {
                        sku: "GWNVL-PBK",
                        price: 14.99,
                        inventory: 200,
                        attributes: { format: "Paperback" },
                    },
                    {
                        sku: "GWNVL-HC",
                        price: 24.99,
                        inventory: 75,
                        attributes: { format: "Hardcover" },
                    },
                ],
            },
        },
    });
    console.log(`Created product: ${sciFiNovel.name}`);

    // Product 4: Wireless Headphones (Electronics)
    const headphones = await prisma.product.create({
        data: {
            name: "SoundWave Wireless Headphones",
            description:
                "Immersive sound quality with noise-cancellation technology. Up to 20 hours of playtime.",
            sku: "SWH-BASE",
            price: 150.0,
            categoryId: electronics.id,
            images: {
                create: [
                    {
                        url: "https://placehold.co/600x400.png?text=Headphones+1&bg=333333&fc=FFFFFF",
                    },
                    {
                        url: "https://placehold.co/600x400.png?text=Headphones+2&bg=555555&fc=EEEEEE",
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: "SWH-BLK",
                        price: 149.99,
                        inventory: 60,
                        attributes: { color: "Matte Black" },
                    },
                    {
                        sku: "SWH-WHT",
                        price: 149.99,
                        inventory: 40,
                        attributes: { color: "Arctic White" },
                    },
                ],
            },
        },
    });
    console.log(`Created product: ${headphones.name}`);

    // Product 5: Denim Jeans (Clothing)
    const jeans = await prisma.product.create({
        data: {
            name: "Urban Rider Denim Jeans",
            description:
                "Classic fit denim jeans, durable and stylish for any urban adventure.",
            sku: "URDJ-BASE",
            price: 60.0,
            categoryId: clothing.id,
            images: {
                create: [
                    {
                        url: "https://placehold.co/600x400.png?text=Jeans+Front&bg=4682B4&fc=FFFFFF",
                    },
                    {
                        url: "https://placehold.co/600x400.png?text=Jeans+Detail&bg=5A9BD8&fc=FFFFFF",
                    },
                ],
            },
            variants: {
                create: [
                    {
                        sku: "URDJ-BLU-3232",
                        price: 59.99,
                        inventory: 50,
                        attributes: { color: "Indigo Blue", size: "32W x 32L" },
                    },
                    {
                        sku: "URDJ-BLK-3432",
                        price: 59.99,
                        inventory: 35,
                        attributes: {
                            color: "Washed Black",
                            size: "34W x 32L",
                        },
                    },
                ],
            },
        },
    });
    console.log(`Created product: ${jeans.name}`);

    console.log(`Seeding finished.`);
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
