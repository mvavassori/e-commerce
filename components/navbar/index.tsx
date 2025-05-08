import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Cart from "../cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserIcon from "../icons/UserIcon";
import ButtonHandler from "./ButtonHandler";

const Navbar = async () => {
    const session = await getServerSession(authOptions);
    return (
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between lg:px-6 p-4 z-50 bg-white">
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
                        <Link
                            href="/"
                            className="underline-offset-4 hover:underline"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/all-products"
                            className="underline-offset-4 hover:underline"
                        >
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about"
                            className=" underline-offset-4 hover:underline"
                        >
                            About
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="flex justify-end md:w-1/3">
                <ButtonHandler />
                {/* {session ? (
          <Link href="/dashboard" className="mr-6 hidden md:block">
            <UserIcon />
          </Link>
        ) : (
          <Link
            href="/signin"
            className="hidden md:block mr-4 text-sm hover:bg-blue-600 justify-end bg-blue-500 text-white px-2 py-1 rounded-full"
          >
            Sign In
          </Link>
        )} */}
                <Cart />
            </div>
        </nav>
    );
};

export default Navbar;
