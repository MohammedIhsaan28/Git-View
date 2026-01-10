import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BgGradient from "../ui/bgGradient";

export default function CTASection() {
    return(
        <section className="relative w-full">
            <BgGradient/>
            <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6  ">
                <div className="flex flex-col text-center justify-center items-center space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl italic md:text-5xl">Let&apos;s deep dive into the projects to explore commits </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 italic">Explore each and every project in detail with summaries and asking questions and meeting summaries</p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                        <div>
                            <Button size='lg' variant={'link'} className="w-full min-[400px]:w-auto hover:no-underline bg-linear-to-r from-slate-900 to-violet-500 hover:from-violet-500 hover:to-slate-900 hover:text-white text-white transition-all duration-300">
                                <Link href='/create' className="flex items-center justify-center italic" >Get Started{' '}
                                <ArrowRight className="ml-2 h-4 w-4 animate-pulse"/>
                                </Link>
                            </Button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}