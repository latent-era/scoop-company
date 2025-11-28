/**
 * Debug Script: Check KV inventory for all nights
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { kv } from '@vercel/kv';
import { EVENT_NIGHTS } from '../lib/inventory';

async function main() {
  console.log('📦 Checking Vercel KV inventory for all nights...\n');
  console.log('─'.repeat(80));

  for (const night of EVENT_NIGHTS) {
    const inventory = await kv.get<{ kid_tickets_sold: number; adult_tickets_sold: number }>(`inventory:${night.key}`);

    console.log(`\n${night.displayName}`);
    console.log(`   Key: ${night.key}`);
    if (inventory) {
      console.log(`   Kid tickets sold: ${inventory.kid_tickets_sold}`);
      console.log(`   Adult tickets sold: ${inventory.adult_tickets_sold}`);
      console.log(`   Total tickets: ${inventory.kid_tickets_sold + inventory.adult_tickets_sold}`);
    } else {
      console.log(`   No inventory data (not initialized)`);
    }
  }

  console.log('\n' + '─'.repeat(80));
}

main()
  .then(() => {
    console.log('\n✅ Inventory check complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
