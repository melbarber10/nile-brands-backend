import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key is missing in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log('✅ Stripe initialized successfully 🔥🚀');

export default stripe;
