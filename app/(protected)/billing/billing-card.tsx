"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function BillingCard() {
  const { data: transactions, isPending } =
    trpc.project.getTransactions.useQuery();

  if (isPending) return <div>Loading...</div>;
  return (
    <div className="mt-4">
      <ul className="divide-y divide-gray-200">
        {transactions?.map((transaction) => (
          <li key={transaction.id} className="flex items-center justify-between py-2 border shadow-md rounded-md bg-violet-100  mb-4 p-4 gap-x-6">
            <div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-md font-semibold py-2">Credits Bought</h3>

                    </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 gap-x-2">
                    <p className="whitespace-nowrap border px-2 py-1 rounded-md shadow-sm text-black">{new Date(transaction.createdAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'medium'})}</p>

                </div>
            </div>

            <div className="flex items-center gap-2">

                <Button className="text-sm  italic whitespace-nowrap border border-violet-400 bg-green-200 px-2 py-1 rounded-md shadow-sm text-black hover:bg-green-400">
                    <ShieldCheck className="text-green-600 w-4 h-4 "/>
                    <p >+{transaction.credits} credits</p>
                </Button>
                
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
