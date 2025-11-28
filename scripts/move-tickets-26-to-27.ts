/**
 * Migration Script: Move 3 tickets from Nov 26th to Nov 27th
 *
 * This script:
 * 1. Finds all completed Stripe checkout sessions for Nov 26th
 * 2. Updates their metadata to point to Nov 27th
 * 3. Updates Vercel KV inventory counts
 * 4. Outputs customer information for manual email notification
 *
 * Run with: npx tsx scripts/move-tickets-26-to-27.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { getNightFromKey } from '../lib/inventory';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

interface TicketToMove {
  sessionId: string;
  customerEmail: string | null;
  customerName: string;
  adultTickets: number;
  kidTickets: number;
  createdAt: Date;
}

async function main() {
  console.log('🎬 Starting ticket migration: Nov 26th → Nov 27th\n');

  // Step 1: Fetch all completed sessions for Nov 26th
  console.log('📋 Step 1: Fetching all Stripe checkout sessions for Nov 26th...');

  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
    status: 'complete',
  });

  const nov26Sessions = sessions.data.filter(session =>
    session.metadata?.night_key === '26-nov'
  );

  console.log(`   Found ${nov26Sessions.length} completed session(s) for Nov 26th\n`);

  if (nov26Sessions.length === 0) {
    console.log('✅ No tickets to move. Exiting.');
    return;
  }

  if (nov26Sessions.length !== 3) {
    console.warn(`⚠️  WARNING: Expected 3 sessions, but found ${nov26Sessions.length}`);
    console.log('   Review the sessions below and confirm this is correct:\n');
  }

  // Extract ticket information
  const ticketsToMove: TicketToMove[] = nov26Sessions.map(session => {
    const metadata = session.metadata || {};

    // Handle both old (3-tier) and new (2-tier) ticket structures
    let adultTickets = 0;
    if (metadata.adult_tickets) {
      adultTickets = parseInt(metadata.adult_tickets || '0');
    } else {
      const adultDrink = parseInt(metadata.adult_drink_tickets || '0');
      const adultFull = parseInt(metadata.adult_full_tickets || '0');
      adultTickets = adultDrink + adultFull;
    }

    return {
      sessionId: session.id,
      customerEmail: session.customer_email || session.customer_details?.email || null,
      customerName: metadata.customer_name || 'Unknown',
      adultTickets,
      kidTickets: parseInt(metadata.kid_tickets || '0'),
      createdAt: new Date(session.created * 1000),
    };
  });

  // Display tickets to be moved
  console.log('🎫 Tickets to be moved:');
  ticketsToMove.forEach((ticket, index) => {
    console.log(`   ${index + 1}. ${ticket.customerName} (${ticket.customerEmail})`);
    console.log(`      ${ticket.adultTickets} adult ticket(s), ${ticket.kidTickets} kid ticket(s)`);
    console.log(`      Purchased: ${ticket.createdAt.toLocaleDateString('en-GB')}`);
  });
  console.log();

  // Calculate total tickets
  const totalAdultTickets = ticketsToMove.reduce((sum, t) => sum + t.adultTickets, 0);
  const totalKidTickets = ticketsToMove.reduce((sum, t) => sum + t.kidTickets, 0);

  console.log(`📊 Total tickets to move: ${totalAdultTickets} adult, ${totalKidTickets} kid\n`);

  // Get Nov 27th event info
  const nov27Event = getNightFromKey('27-nov');
  if (!nov27Event) {
    throw new Error('Could not find Nov 27th event configuration');
  }

  console.log(`🎯 Target event: ${nov27Event.displayName}\n`);

  // Step 2: Update Stripe metadata for each session
  console.log('📝 Step 2: Updating Stripe checkout session metadata...');

  for (const ticket of ticketsToMove) {
    console.log(`   Updating session ${ticket.sessionId}...`);

    await stripe.checkout.sessions.update(ticket.sessionId, {
      metadata: {
        night_key: '27-nov',
        event_night: nov27Event.value,
      },
    });
  }

  console.log('   ✅ All Stripe sessions updated\n');

  // Step 3: Update Vercel KV inventory counts
  console.log('📦 Step 3: Updating Vercel KV inventory counts...');

  // Get current inventory
  const nov26Inventory = await kv.get<{ kid_tickets_sold: number; adult_tickets_sold: number }>('inventory:26-nov');
  const nov27Inventory = await kv.get<{ kid_tickets_sold: number; adult_tickets_sold: number }>('inventory:27-nov');

  console.log(`   Current Nov 26th inventory: ${nov26Inventory?.adult_tickets_sold || 0} adult, ${nov26Inventory?.kid_tickets_sold || 0} kid`);
  console.log(`   Current Nov 27th inventory: ${nov27Inventory?.adult_tickets_sold || 0} adult, ${nov27Inventory?.kid_tickets_sold || 0} kid`);

  // Update Nov 26th (decrease)
  const newNov26Inventory = {
    kid_tickets_sold: Math.max(0, (nov26Inventory?.kid_tickets_sold || 0) - totalKidTickets),
    adult_tickets_sold: Math.max(0, (nov26Inventory?.adult_tickets_sold || 0) - totalAdultTickets),
  };

  await kv.set('inventory:26-nov', newNov26Inventory);
  console.log(`   ✅ Nov 26th updated: ${newNov26Inventory.adult_tickets_sold} adult, ${newNov26Inventory.kid_tickets_sold} kid`);

  // Update Nov 27th (increase)
  const newNov27Inventory = {
    kid_tickets_sold: (nov27Inventory?.kid_tickets_sold || 0) + totalKidTickets,
    adult_tickets_sold: (nov27Inventory?.adult_tickets_sold || 0) + totalAdultTickets,
  };

  await kv.set('inventory:27-nov', newNov27Inventory);
  console.log(`   ✅ Nov 27th updated: ${newNov27Inventory.adult_tickets_sold} adult, ${newNov27Inventory.kid_tickets_sold} kid\n`);

  // Step 4: Customer notification information
  console.log('📧 Step 4: Customer Notification Information');
  console.log('─'.repeat(80));
  console.log('\n⚠️  IMPORTANT: You need to manually notify these customers about the change.\n');
  console.log('Here are the customers to contact:\n');

  ticketsToMove.forEach((ticket, index) => {
    console.log(`${index + 1}. ${ticket.customerName}`);
    console.log(`   Email: ${ticket.customerEmail || 'NO EMAIL ON FILE'}`);
    console.log(`   Tickets: ${ticket.adultTickets} adult${ticket.adultTickets !== 1 ? 's' : ''}${ticket.kidTickets > 0 ? `, ${ticket.kidTickets} kid${ticket.kidTickets !== 1 ? 's' : ''}` : ''}`);
    console.log();
  });

  console.log('Suggested email message:');
  console.log('─'.repeat(80));
  console.log(`
Subject: Important: Your Fifth Wall booking has been moved to November 27th

Dear [Customer Name],

We're writing to inform you about a change to your Fifth Wall booking.

Your original booking was for Wednesday, November 26th (The Holiday).
This has now been changed to Thursday, November 27th (Elf).

New Event Details:
• Date: Thursday, 27th November 2025
• Arrival: 6:30pm
• Film start: 6:45pm
• Film: Elf
• Event type: Adults only

Your tickets remain valid and all other details stay the same.
Please keep your original confirmation/QR code for entry.

We apologize for any inconvenience this may cause. If you have any questions
or concerns, please don't hesitate to contact us.

Looking forward to seeing you!

The Fifth Wall Team
`);
  console.log('─'.repeat(80));

  console.log('\n✅ Migration completed successfully!\n');
  console.log('Summary:');
  console.log(`  • ${ticketsToMove.length} customer(s) affected`);
  console.log(`  • ${totalAdultTickets} adult ticket(s) moved`);
  console.log(`  • ${totalKidTickets} kid ticket(s) moved`);
  console.log(`  • Stripe metadata: Updated ✓`);
  console.log(`  • KV inventory: Updated ✓`);
  console.log(`  • Customer emails: Please send manually\n`);
}

// Run the script
main()
  .then(() => {
    console.log('🎉 Script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error running migration:', error);
    process.exit(1);
  });
