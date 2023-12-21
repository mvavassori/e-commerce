import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
      <p className="mt-4 text-lg text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis
        semper lectus, ac scelerisque enim semper ac. Praesent tincidunt, enim
        ac egestas scelerisque, lectus quam ultricies nibh, vitae faucibus enim
        velit quis mauris.
      </p>

      <h2 className="mt-16 text-2xl font-bold text-gray-900">Our Story</h2>
      <p className="mt-4 text-lg text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor
        faucibus enim, sed semper eros scelerisque nec. Donec scelerisque auctor
        quam, vitae ultricies mauris faucibus at. Sed semper lectus vel lacus
        semper, ac tristique mauris faucibus. Curabitur a quam sit amet eros
        scelerisque iaculis.
      </p>

      <h2 className="mt-16 text-2xl font-bold text-gray-900">Our Mission</h2>
      <p className="mt-4 text-lg text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt,
        orci quis scelerisque semper, ipsum quam scelerisque eros, ac semper
        lectus velit sed dui. Vivamus ac quam vitae eros tincidunt scelerisque.
        Donec et mauris ac quam ultricies ullamcorper.
      </p>
      <div className="my-12">
        <Link
          className=" bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          href="/all-products"
        >
          Explore Our Products
        </Link>
      </div>
    </div>
  );
};

export default About;
