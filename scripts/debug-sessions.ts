/**
 * Debug Script: List all Stripe sessions to understand what's in the database
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

async function main() {
  console.log('🔍 Fetching all Stripe checkout sessions...\n');

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
  });

  console.log(`Found ${sessions.data.length} total sessions\n`);
  console.log('─'.repeat(100));

  sessions.data.forEach((session, index) => {
    const metadata = session.metadata || {};
    const nightKey = metadata.night_key || 'NO NIGHT KEY';
    const customerEmail = session.customer_email || session.customer_details?.email || 'NO EMAIL';
    const status = session.status;
    const created = new Date(session.created * 1000).toLocaleString('en-GB');

    console.log(`\n${index + 1}. Session ID: ${session.id}`);
    console.log(`   Status: ${status}`);
    console.log(`   Night Key: ${nightKey}`);
    console.log(`   Customer: ${metadata.customer_name || 'Unknown'} (${customerEmail})`);
    console.log(`   Created: ${created}`);
    console.log(`   Kid Tickets: ${metadata.kid_tickets || '0'}`);
    console.log(`   Adult Tickets: ${metadata.adult_tickets || metadata.adult_drink_tickets || metadata.adult_full_tickets || '0'}`);
  });

  console.log('\n' + '─'.repeat(100));

  // Group by night_key and status
  const groupedByNight: Record<string, { complete: number; other: number }> = {};

  sessions.data.forEach(session => {
    const nightKey = session.metadata?.night_key || 'UNKNOWN';
    if (!groupedByNight[nightKey]) {
      groupedByNight[nightKey] = { complete: 0, other: 0 };
    }

    if (session.status === 'complete') {
      groupedByNight[nightKey].complete++;
    } else {
      groupedByNight[nightKey].other++;
    }
  });

  console.log('\n📊 Summary by Night:');
  Object.entries(groupedByNight).forEach(([nightKey, counts]) => {
    console.log(`   ${nightKey}: ${counts.complete} complete, ${counts.other} other statuses`);
  });
}

main()
  .then(() => {
    console.log('\n✅ Debug complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
