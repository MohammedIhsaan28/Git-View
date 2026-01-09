'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion: '2025-12-15.clover'
})

export async function createCheckoutSession(credits:number){
    const {userId} = await auth();

    if(!userId){
        throw new Error('Unauthorized');
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data:{
                    currency: 'usd',
                    product_data:{
                        name: `${credits} Gitview Credits`,
                    },
                    unit_amount: Math.round((credits / 50)* 100)
                },
                quantity: 1
            }
        ],
        customer_creation: 'always',
        mode:'payment',
        success_url: `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_APP_URL : process.env.NEXT_PUBLIC_APP_URL_PROD}/billing`,
        cancel_url: `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_APP_URL : process.env.NEXT_PUBLIC_APP_URL_PROD}/billing`,
        client_reference_id: userId.toString(),
        metadata:{
            credits
        }
    })
    return redirect(session.url!);
}
