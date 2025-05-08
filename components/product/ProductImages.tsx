"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ProductImage } from "@prisma/client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";

interface ProductImagesProps {
    images: ProductImage[];
    productName: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({
    images,
    productName,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Check if router is ready and has query parameters
        const imageId = searchParams.get("image");
        if (imageId) {
            const image = images.find(
                (image) => image.id === parseInt(imageId)
            );
            setSelectedImage(image || null);
        }
        setIsLoading(false);
    }, [searchParams, images]);

    const handleImageClick = (image: ProductImage) => {
        // now you got a read/write object
        const queryParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );

        queryParams.set("image", image.id.toString());

        // cast to string
        const attributes = queryParams.toString();
        // or const query = `${"?".repeat(search.length && 1)}${search}`;
        const query = attributes ? `?${attributes}` : "";

        router.push(`${pathname}${query}`, { scroll: false });

        setSelectedImage(image);
    };

    const updateImage = (newIndex: number) => {
        const imageId = images[newIndex].id.toString();
        const queryParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );

        queryParams.set("image", imageId.toString());

        const attributes = queryParams.toString();
        const query = attributes ? `?${attributes}` : "";
        router.push(`${pathname}${query}`, { scroll: false });

        setCurrentIndex(newIndex);
    };

    const handlePrev = () => {
        const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        updateImage(prevIndex);
    };

    const handleNext = () => {
        const nextIndex =
            currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        updateImage(nextIndex);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-full max-w-[500px]">
                {/* Container with max-width */}
                {/* Left Arrow */}
                <div
                    className="absolute top-1/2 left-0 z-20 flex items-center justify-center cursor-pointer transform -translate-y-1/2 translate-x-3"
                    onClick={handlePrev}
                >
                    <div className="bg-white p-1 md:p-2 rounded-full shadow-lg active:bg-gray-200">
                        <ArrowLeftIcon />
                    </div>
                </div>
                {/* Main Image */}
                {!isLoading ? (
                    <Image
                        src={selectedImage?.url || images[0].url}
                        alt={productName + " image"}
                        width={500}
                        height={500}
                        className="object-contain mx-auto"
                    />
                ) : (
                    <div style={{ width: "500px", height: "500px" }} />
                )}
                {/* Right Arrow */}
                <div
                    className="absolute top-1/2 right-0 z-20 flex items-center justify-center cursor-pointer transform -translate-y-1/2 -translate-x-3"
                    onClick={handleNext}
                >
                    <div className="bg-white p-1 md:p-2 rounded-full shadow-lg active:bg-gray-200">
                        <ArrowRightIcon />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-16 mb-12 justify-center">
                {images.length > 1 &&
                    images.map((image: ProductImage) => (
                        <Image
                            priority={true}
                            key={image.id}
                            src={image.url}
                            alt={productName + "image"}
                            width={500}
                            height={500}
                            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
                            onClick={() => handleImageClick(image)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ProductImages;
