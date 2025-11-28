/**
 * Simple Inventory Adjustment Script
 *
 * Adjusts ticket counts:
 * - Nov 26th: Decrease adult_tickets_sold by 3
 * - Nov 27th: Increase adult_tickets_sold by 3
 *
 * Run with: npx tsx scripts/adjust-inventory-26-27.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { kv } from '@vercel/kv';

async function main() {
  console.log('🎬 Starting inventory adjustment...\n');

  const TICKETS_TO_MOVE = 3;

  // Step 1: Get current inventory
  console.log('📋 Step 1: Fetching current inventory...');

  const nov26Inventory = await kv.get<{ kid_tickets_sold: number; adult_tickets_sold: number }>('inventory:26-nov');
  const nov27Inventory = await kv.get<{ kid_tickets_sold: number; adult_tickets_sold: number }>('inventory:27-nov');

  console.log(`\n   Nov 26th (The Holiday) - Current:`);
  console.log(`      Kid tickets sold: ${nov26Inventory?.kid_tickets_sold || 0}`);
  console.log(`      Adult tickets sold: ${nov26Inventory?.adult_tickets_sold || 0}`);

  console.log(`\n   Nov 27th (Elf) - Current:`);
  console.log(`      Kid tickets sold: ${nov27Inventory?.kid_tickets_sold || 0}`);
  console.log(`      Adult tickets sold: ${nov27Inventory?.adult_tickets_sold || 0}`);

  // Check if we have enough tickets to move from Nov 26th
  const currentNov26Adult = nov26Inventory?.adult_tickets_sold || 0;
  if (currentNov26Adult < TICKETS_TO_MOVE) {
    console.log(`\n⚠️  WARNING: Nov 26th only has ${currentNov26Adult} adult tickets sold.`);
    console.log(`   Cannot move ${TICKETS_TO_MOVE} tickets.`);
    console.log(`\n   Do you want to proceed anyway? This might indicate the inventory is out of sync.`);
    throw new Error('Not enough tickets on Nov 26th to move');
  }

  // Step 2: Update inventory
  console.log(`\n📝 Step 2: Adjusting inventory (moving ${TICKETS_TO_MOVE} adult tickets)...\n`);

  // Update Nov 26th (decrease by 3)
  const newNov26Inventory = {
    kid_tickets_sold: nov26Inventory?.kid_tickets_sold || 0,
    adult_tickets_sold: currentNov26Adult - TICKETS_TO_MOVE,
  };

  await kv.set('inventory:26-nov', newNov26Inventory);
  console.log(`   ✅ Nov 26th updated:`);
  console.log(`      Kid tickets sold: ${newNov26Inventory.kid_tickets_sold}`);
  console.log(`      Adult tickets sold: ${newNov26Inventory.adult_tickets_sold} (was ${currentNov26Adult})`);

  // Update Nov 27th (increase by 3)
  const currentNov27Adult = nov27Inventory?.adult_tickets_sold || 0;
  const newNov27Inventory = {
    kid_tickets_sold: nov27Inventory?.kid_tickets_sold || 0,
    adult_tickets_sold: currentNov27Adult + TICKETS_TO_MOVE,
  };

  await kv.set('inventory:27-nov', newNov27Inventory);
  console.log(`\n   ✅ Nov 27th updated:`);
  console.log(`      Kid tickets sold: ${newNov27Inventory.kid_tickets_sold}`);
  console.log(`      Adult tickets sold: ${newNov27Inventory.adult_tickets_sold} (was ${currentNov27Adult})`);

  // Step 3: Summary
  console.log('\n' + '─'.repeat(80));
  console.log('\n✅ Inventory adjustment completed successfully!\n');
  console.log('Summary:');
  console.log(`  • Moved ${TICKETS_TO_MOVE} adult tickets from Nov 26th to Nov 27th`);
  console.log(`  • Nov 26th now has ${newNov26Inventory.adult_tickets_sold} adult tickets sold`);
  console.log(`  • Nov 27th now has ${newNov27Inventory.adult_tickets_sold} adult tickets sold`);
  console.log('\n' + '─'.repeat(80) + '\n');
}

// Run the script
main()
  .then(() => {
    console.log('🎉 Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error running adjustment:', error.message);
    process.exit(1);
  });
