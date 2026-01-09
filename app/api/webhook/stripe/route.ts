import db from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(event.type);

    if (event.type === "checkout.session.completed") {
      const credits = Number(session.metadata?.["credits"]);
      const userId = session.client_reference_id;
      if (!userId || !credits) {
        return NextResponse.json(
          { error: "Missing userId or credits" },
          { status: 400 }
        );
      }
      await db.stripeTransaction.create({
        data: {
          userId,
          credits,
        },
      });

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: credits,
          },
        },
      });
      return NextResponse.json(
        { message: "Credits added successfully" },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature ${err}` },
      { status: 400 }
    );
  }

    return NextResponse.json({ success: true }, { status: 200 });
}
