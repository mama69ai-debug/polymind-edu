import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    });
  }
  
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => {
    const instance = getStripe();
    const value = instance[prop as keyof Stripe];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
