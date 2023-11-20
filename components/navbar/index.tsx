import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Cart from "../cart";

export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between lg:px-6 p-4">
      <div className="block flex-none md:hidden">
        <MobileMenu />
      </div>
      <div className="flex w-full items-center justify-center md:justify-normal">
        <Link href="/" className="text-xl font-bold">
          <span className="text-blue-600">e</span>
          <span>-commerce</span>
        </Link>

        <ul className="ml-12 hidden gap-6 text-sm md:flex md:items-center">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className=" underline-offset-4 hover:underline">
              About
            </Link>
          </li>
        </ul>

        {/* {menu.length ? (
                <ul className="hidden gap-6 text-sm md:flex md:items-center">
                  {menu.map((item: Menu) => (
                    <li key={item.title}>
                      <Link
                        href={item.path}
                        className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null} */}
      </div>
      {/* <div className="hidden justify-center md:flex md:w-1/3">
        <Search />
      </div> */}
      <div className="flex justify-end md:w-1/3">
        {/* <Suspense fallback={<OpenCart />}> */}
        <Cart />
        {/* </Suspense> */}
      </div>
    </nav>
  );
}
