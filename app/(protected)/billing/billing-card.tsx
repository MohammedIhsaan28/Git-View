'use client';

import { trpc } from "@/app/_trpc/client";

export default function BillingCard(){

    const {data: transactions,isPending} = trpc.project.getTransactions.useQuery();

    if(isPending) return <div>Loading...</div>
    return(
        <div>
            {
                transactions?.map((transaction)=> (
                    <>
                    <div key={transaction.id}>
                        {transaction.credits}
                        
                    </div>
                    <p>{transaction.createdAt.slice(0,10)}</p>
                    
                    </>
                    
                ))
            }

        </div>
    )
}