import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      console.error('Missing metadata in session:', session.id);
      return NextResponse.json(
        { error: 'Missing metadata' },
        { status: 400 }
      );
    }

    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single();

    if (existingOrder) {
      console.log('Order already exists for session:', session.id);
      return NextResponse.json({ received: true });
    }

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        course_id: courseId,
        stripe_session_id: session.id,
        status: 'paid',
        amount: (session.amount_total || 0) / 100,
      });

    if (orderError) {
      console.error('Failed to create order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    const { data: existingEnrollment } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (!existingEnrollment) {
      const { error: enrollmentError } = await supabaseAdmin
        .from('enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
        });

      if (enrollmentError) {
        console.error('Failed to create enrollment:', enrollmentError);
        return NextResponse.json(
          { error: 'Failed to create enrollment' },
          { status: 500 }
        );
      }
    }

    console.log('Successfully processed payment for session:', session.id);
  }

  return NextResponse.json({ received: true });
}
