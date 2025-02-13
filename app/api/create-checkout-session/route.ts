import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../../config/stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, price, period, websiteId } = body;
    const origin = req.headers.get('origin');

    // Create a Checkout Session with line items matching your plan details.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Love Yu ${plan} Plan`,
              description: `${plan} Plan - ${period}`,
            },
            unit_amount: Math.round(parseFloat(price) * 100),
            recurring: period === 'Yearly' ? { interval: 'year' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: period === 'Yearly' ? 'subscription' : 'payment',
      success_url: `${origin}/${websiteId}`,
      cancel_url: `${origin}/create`,
    });
    
// Create a website and get the websiteId.

    return NextResponse.json({ sessionId: session.id, websiteId });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}