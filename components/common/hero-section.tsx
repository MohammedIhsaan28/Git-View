

import {  ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import BgGradient from "../ui/bgGradient";

export default function HeroSection() {


    return(
        <section className="relative mx-auto flex flex-col z-0 items-center justify-center sm:py-20 transition-all animate-in  max-w-7xl">
            <BgGradient/>
            <div className="relative flex px-3 py-1 overflow-hidden rounded-full border border-violet-700  bg-gradient-to-r from-violet-200 via-violet-300 to-violet-400 animate-gradient-x group">
                <Sparkles className="h-4 w-4 mr-2 mt-0.5 text-violet-600 animate-pulse"/>
                <span className="text-sm text-violet-600 font-semibold italic">Powered by AI</span>
            </div>

            <div className="font-bold italic py-6 text-center text-4xl sm:text-5xl lg:text-6xl">
                <h1 >
                Chat with your {" "}
            <span className="relative inline-block">
            <span className="relative z-10 px-2">projects {' '}</span>
                <span
                className="absolute inset-0 bg-violet-200 -rotate-2 rounded-lg transform -skew-y-1"
                aria-hidden="true"
            ></span>{" "}
            </span>
            </h1>
            <h1>in depth</h1>
            </div>

            <h2 className="text-lg italic sm:text-xl lg:text-xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">
                    Improve your coding and project knowledge in clear and simple conversations  
            </h2>

            <div className="flex" >
                <Button variant={'link'} className=" text-white mt-6 text-base sm:text-lg lg:text-xl rounded-full px-8 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8 lg:mt-16
             hover:no-underline font-extrabold shadow-lg transition-all duration-300 bg-violet-200 hover:bg-violet-300  border-violet-400 hover:border-violet-500">
                <Link href={'/create'} className="flex items-center justify-center gap-2">

                    <span className="text-violet-600 italic font-semibold">Get Started</span>
                    <ArrowRight className="h-6 w-6 animate-pulse text-violet-500"/>
                </Link>
                </Button>
            </div>
            

        </section>
    )
}