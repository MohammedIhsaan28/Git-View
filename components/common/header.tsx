import Image from "next/image";
import NavLink from "../ui/nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {

    return(
        <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
            <div className="flex lg:flex-1">
                <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
                    <Image src={'/logo.png'} alt='Logo' width={30} height={30} />
                    <span className="font-bold lg:text-xl text-gray-900 italic">GitView</span>
                </NavLink>
            </div>
            <div className="flex lg:justify-center gap-4 lg:gap-8 lg:items-center font-medium italic">
                <NavLink href="/billing">Billing</NavLink>
                <SignedIn>
                    <NavLink href='/dashboard' > Dashboard</NavLink>
                </SignedIn>
            </div>
            <div className="flex lg:justify-end lg:flex-1">
                <SignedIn>
                    <div className="flex gap-x-4 items-center font-medium italic">
                        <NavLink href='/create' className="">Upload a Project</NavLink>
                        <SignedIn>
                            <UserButton/>
                        </SignedIn>
                    </div>
                </SignedIn>

                <SignedOut>
                    <NavLink href="/sign-in">Sign In</NavLink>
                </SignedOut>

            </div>
        </nav>
    )
}