'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function createCheckoutSession(credits: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const amountInCents = credits * 2;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${credits} Gitview Credits`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_APP_URL! : 'https://git-view-2jkd.vercel.app'}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_APP_URL! : 'https://git-view-2jkd.vercel.app'}/billing`,

    client_reference_id: userId,
    metadata: {
      credits: credits.toString(),
    },
  });

  // ✅ redirect MUST be last & uncaught
  console.log('Seesion Url for this session: ',session.url);
  redirect(session.url!);
}
