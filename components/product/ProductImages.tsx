"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ProductImage } from "@prisma/client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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

  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if router is ready and has query parameters
    const imageId = searchParams.get("image");
    if (imageId) {
      const image = images.find((image) => image.id === parseInt(imageId));
      setSelectedImage(image || null);
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleImageClick = (image: ProductImage) => {
    // now you got a read/write object
    const queryParams = new URLSearchParams(Array.from(searchParams.entries()));

    queryParams.set("image", image.id.toString());

    // cast to string
    const attributes = queryParams.toString();
    // or const query = `${"?".repeat(search.length && 1)}${search}`;
    const query = attributes ? `?${attributes}` : "";

    router.push(`${pathname}${query}`, { scroll: false });

    setSelectedImage(image);
  };

  return (
    <div className="w-full h-full">
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
      <div className="flex flex-wrap gap-6 mt-16 mb-12 justify-center">
        {images.length > 1 &&
          images.map((image: ProductImage) => (
            <Image
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
