'use client';

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { createCheckoutSession } from "@/lib/stripe";
import { Info } from "lucide-react";
import { useState } from "react";
import BillingCard from "./billing-card";

export default function BillingPage(){
    
    const {data: user} = trpc.project.getMyCredits.useQuery();
    const [creditsToBuy,setCreditsToBuy] = useState([100]);
    const creditsToByAmount = creditsToBuy[0]!
    const price = (creditsToByAmount /50).toFixed(2);
    return(

        <>
        <div>
            <h1 className='text-xl font-semibold'>
            Billing
            </h1>
            <div className="h-2">

            </div>
            <p>You currently have {user?.credits || '---'} credits</p>

            <div className="h-2"></div>

            <div className="bg-violet-50 px-4 py-2 rounded-md border border-violet-200 text-violet-700">
                <div className="flex items-center gap-2">
                    <Info className="size-4"/>
                    <p className="text-sm italic">Each credit allows you to index 1 file in a repository</p>

                </div>
                <p className="text-sm mt-1">E.g. If your project has 100 files, you will nedd 100 credits to index it</p>

            </div>

            <div className='h-4'></div>

            <Slider defaultValue={[100]} max={1000} min={10} step={10} onValueChange={value => setCreditsToBuy(value)}  value={creditsToBuy} />
            <div className="h-4"></div>
            <Button onClick={()=> {
                createCheckoutSession(creditsToByAmount);
                
            }}>
                Buy {creditsToByAmount} credits for ${price}
            </Button>
            
        </div>

        <div>
            <BillingCard/>
        </div>
        </>
    )
}
