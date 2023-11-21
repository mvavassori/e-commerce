import Image from "next/image";

export default function ProductPage() {
  return (
    <div className="md:flex px-4 sm:px-6 lg:px-20 mt-10 mb-12">
      <div className="w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="product"
          width={500}
          height={500}
          className="object-contain mx-auto"
        />
        <div className="flex flex-wrap gap-6 mt-16 mb-12 justify-center">
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product"
            width={500}
            height={500}
            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
          />
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product"
            width={500}
            height={500}
            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
          />
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product"
            width={500}
            height={500}
            className="object-fit w-20 h-20 cursor-pointer rounded border-2 border-gray-300"
          />
        </div>
      </div>
      <div className="md:w-2/5">
        <h1 className="text-3xl md:text-5xl font-bold">Product Name</h1>
        <p className="font-semibold text-lg mt-4">$ 19,99</p>
        <p className="font-semibold mt-6">Size</p>
        <div className="flex flex-wrap gap-2">
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            XS
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            S
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            M
          </button>
        </div>
        <p className="font-semibold mt-6">Color</p>
        <div className="flex flex-wrap gap-2">
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            White
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            Black
          </button>
          <button className="border border-gray-400 hover:ring-blue-400 hover:ring-2 active:bg-gray-300 px-2 rounded-full mt-3">
            Blue
          </button>
        </div>
        <div>
          <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2 px-16 rounded-full my-14 font-semibold">
            Add to Cart
          </button>
        </div>
        <p className="text-sm">
          Eirmod dolores et et rebum no takimata elit lorem et duo velit
          luptatum sea luptatum stet consetetur et. Justo lorem sadipscing est
          takimata hendrerit dolor diam autem blandit at nulla at ipsum erat
          voluptua takimata. Id tempor diam. Lorem blandit et ea ea consequat
          ipsum lobortis sit no diam consetetur sit ea clita nonummy gubergren.
        </p>
      </div>
    </div>
  );
}
