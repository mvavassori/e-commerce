import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 lg:px-8 pt-4 border-t-2 bg-gray-50">
      <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link href="/" className="text-xl font-bold">
            <span className="text-blue-600">e</span>
            <span>-commerce</span>
          </Link>

          <div className="mt-6 lg:max-w-xl">
            <p className="text-sm text-gray-800">
              Sed odio nonumy feugait adipiscing elitr erat. Et elitr lorem. At
              vulputate duo sadipscing lorem aliquyam consetetur eirmod est
              labore duo lorem duis. Erat lobortis amet sit aliquyam. Et dolor
              id molestie. Volutpat sea luptatum eos kasd adipiscing no justo
              eirmod amet iriure dolore. Ea amet dolor autem diam at nisl diam
              at et elitr feugait ipsum.
            </p>
          </div>
        </div>
        <div>
          <p className="text-base font-bold tracking-wide text-gray-900">
            Contacts
          </p>
          <div className="flex">
            <p className="mr-1 text-gray-800">email:</p>
            <a
              href="mailto:support@e-commerce.com"
              className=""
              target="_blank"
              rel="noopener noreferrer"
            >
              support@example.com
            </a>
          </div>
        </div>
        <div>
          <Link
            className="text-base font-bold tracking-wide text-gray-900"
            href="/all-products"
          >
            All Products
          </Link>
        </div>
      </div>

      <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} e-commerce. All rights reserved.
        </p>
        <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
          <li>
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-600 transition-colors
              duration-300 hover:text-deep-purple-accent-400"
            >
              Privacy &amp; Cookies Policy
            </Link>
          </li>
          <li>
            <Link
              href="/terms-of-service"
              className="text-sm text-gray-600 transition-colors
              duration-300 hover:text-deep-purple-accent-400"
            >
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
