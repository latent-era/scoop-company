import { kv } from '@vercel/kv';

// Event night configuration type
export interface EventNight {
  key: string;
  displayName: string;
  value: string;
  movie: string;
  date: string; // ISO format: '2025-12-20T17:00:00'
  adultOnly?: boolean;
  venue?: string;
  capacity: number;
}

// Event nights configuration
export const EVENT_NIGHTS: readonly EventNight[] = [
  {
    key: '18-oct-warlingham',
    displayName: 'Sun 18 Oct · Hotel Transylvania · 3pm · Warlingham',
    value: 'Sun 18 Oct, 3pm, Warlingham',
    movie: 'Hotel Transylvania',
    venue: 'Warlingham',
    date: '2026-10-18T15:00:00',
    capacity: 26,
  },
  {
    key: '23-oct-oxted',
    displayName: 'Fri 23 Oct · The Addams Family · 5pm · Oxted',
    value: 'Fri 23 Oct, 5pm, Oxted',
    movie: 'The Addams Family',
    venue: 'Oxted',
    date: '2026-10-23T17:00:00',
    capacity: 25,
  },
  {
    key: '24-oct-oxted',
    displayName: 'Sat 24 Oct · Hotel Transylvania · 5pm · Oxted',
    value: 'Sat 24 Oct, 5pm, Oxted',
    movie: 'Hotel Transylvania',
    venue: 'Oxted',
    date: '2026-10-24T17:00:00',
    capacity: 25,
  },
];

export const MAX_KID_TICKETS = 20;
export const MAX_ADULT_TICKETS = 15;
export const RESERVATION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

// Global sold out flag - set to true to disable all ticket sales
export const TICKETS_SOLD_OUT = false;

// Flag to hide booking while planning new dates - shows "Coming Soon" message
export const BOOKING_COMING_SOON = false;

// Global sold out flag for Yule Logs - set to true to disable all Yule Log orders
export const YULE_LOGS_SOLD_OUT = true;

// Global sold out flag for Gelato Cakes - set to true to disable all Gelato Cake orders
export const GELATO_CAKES_SOLD_OUT = false;

// Earliest date a gelato cake can be collected, as 'YYYY-MM-DD'.
// Use this to block orders during a holiday/closure (e.g. when Maria is away).
// It shows a banner and stops the date picker offering any earlier date, so no
// one can build and pay for a cake they can't collect. Set to '' to switch this
// off and revert to the normal 72-hours-notice rule.
export const GELATO_CAKES_EARLIEST_COLLECTION = '2026-09-05';

// Types
export interface InventoryData {
  kid_tickets_sold: number;
  adult_tickets_sold: number;
}

export interface ReservationData {
  kidTickets: number;
  adultTickets: number;
  nightKey: string;
  createdAt: number;
  sessionId: string;
}

export interface Availability {
  nightKey: string;
  displayName: string;
  value: string;
  kidTicketsRemaining: number;
  adultTicketsRemaining: number;
  remaining: number;
  capacity: number;
  isSoldOut: boolean;
  adultOnly?: boolean;
}

// Helper to get night key from display value
export function getNightKeyFromValue(value: string): string | null {
  const night = EVENT_NIGHTS.find(n => n.value === value);
  return night ? night.key : null;
}

// Helper to get upcoming event nights (filters out past events and same-day events after 3pm)
export function getUpcomingEventNights(): EventNight[] {
  const now = new Date();
  return EVENT_NIGHTS.filter(night => {
    const eventDate = new Date(night.date);

    // If event has already started, exclude it
    if (eventDate <= now) return false;

    // If same day and past 3pm, exclude it (to avoid last-minute booking chaos)
    const isSameDay = eventDate.toDateString() === now.toDateString();
    const isPast3pm = now.getHours() >= 15;

    if (isSameDay && isPast3pm) return false;

    return true;
  });
}

// Helper to get night display info from key
export function getNightFromKey(key: string) {
  return EVENT_NIGHTS.find(n => n.key === key);
}

// Get current inventory for a specific night
export async function getInventory(nightKey: string): Promise<InventoryData> {
  const key = `inventory:${nightKey}`;
  const data = await kv.get<InventoryData>(key);

  if (!data) {
    // If not found, return zero (uninitialized)
    return {
      kid_tickets_sold: 0,
      adult_tickets_sold: 0,
    };
  }

  return data;
}

// Get availability for a specific night
export async function getAvailability(nightKey: string): Promise<Availability> {
  const nightInfo = getNightFromKey(nightKey);
  if (!nightInfo) {
    throw new Error(`Invalid night key: ${nightKey}`);
  }

  const inventory = await getInventory(nightKey);

  // Get active reservations for this night
  const reservations = await getActiveReservations(nightKey);
  const reservedKids = reservations.reduce((sum, r) => sum + r.kidTickets, 0);
  const reservedAdults = reservations.reduce((sum, r) => sum + r.adultTickets, 0);

  const capacity = nightInfo.capacity ?? 25;
  const reservedTotal = reservedKids + reservedAdults;
  const remaining = Math.max(0, capacity - inventory.kid_tickets_sold - inventory.adult_tickets_sold - reservedTotal);

  return {
    nightKey,
    displayName: nightInfo.displayName,
    value: nightInfo.value,
    kidTicketsRemaining: remaining,
    adultTicketsRemaining: remaining,
    remaining,
    capacity,
    isSoldOut: remaining <= 0,
    adultOnly: nightInfo.adultOnly,
  };
}

// Get availability for all upcoming nights (filters out past events)
export async function getAllAvailability(): Promise<Availability[]> {
  const upcomingNights = getUpcomingEventNights();
  const availabilities = await Promise.all(
    upcomingNights.map(night => getAvailability(night.key))
  );
  return availabilities;
}

// Get active reservations for a night
async function getActiveReservations(nightKey: string): Promise<ReservationData[]> {
  const pattern = `reservation:*:${nightKey}`;
  const keys = await kv.keys(pattern);

  const now = Date.now();
  const activeReservations: ReservationData[] = [];

  for (const key of keys) {
    const reservation = await kv.get<ReservationData>(key);
    if (reservation && (now - reservation.createdAt) < RESERVATION_TIMEOUT_MS) {
      activeReservations.push(reservation);
    }
  }

  return activeReservations;
}

// Reserve tickets (called before Stripe checkout)
export async function reserveTickets(
  nightKey: string,
  kidTickets: number,
  adultTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  const nightInfo = getNightFromKey(nightKey);

  // Check if booking is being made too late (same day after 3pm)
  if (nightInfo) {
    const now = new Date();
    const eventDate = new Date(nightInfo.date);
    const isSameDay = eventDate.toDateString() === now.toDateString();
    const isPast3pm = now.getHours() >= 15;

    if (isSameDay && isPast3pm) {
      return { success: false, error: 'Bookings for same-day films close at 3pm' };
    }
  }

  // Validate inputs - general admission, one flat price, every booking needs a child.
  const totalTickets = kidTickets + adultTickets;
  if (kidTickets < 1) {
    return { success: false, error: 'Every booking needs at least one child ticket.' };
  }
  if (totalTickets > 10) {
    return { success: false, error: 'Up to 10 tickets per booking. For a bigger group, please email us.' };
  }

  // Check availability (total seats, general admission)
  const availability = await getAvailability(nightKey);

  if (availability.remaining < totalTickets) {
    return {
      success: false,
      error: `Only ${availability.remaining} seat(s) left for this showing.`
    };
  }

  // Create reservation
  const reservation: ReservationData = {
    kidTickets,
    adultTickets,
    nightKey,
    createdAt: Date.now(),
    sessionId,
  };

  const reservationKey = `reservation:${sessionId}:${nightKey}`;

  // Store reservation with 35-minute expiry (slightly longer than timeout for safety)
  await kv.set(reservationKey, reservation, {
    ex: Math.ceil(RESERVATION_TIMEOUT_MS / 1000) + 300 // +5 minutes buffer
  });

  return { success: true };
}

// Confirm booking (called after successful Stripe payment)
export async function confirmBooking(
  nightKey: string,
  kidTickets: number,
  adultTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current inventory
    const inventory = await getInventory(nightKey);

    // Update inventory
    const newInventory: InventoryData = {
      kid_tickets_sold: inventory.kid_tickets_sold + kidTickets,
      adult_tickets_sold: inventory.adult_tickets_sold + adultTickets,
    };

    // Save updated inventory
    const inventoryKey = `inventory:${nightKey}`;
    await kv.set(inventoryKey, newInventory);

    // Remove reservation
    const reservationKey = `reservation:${sessionId}:${nightKey}`;
    await kv.del(reservationKey);

    return { success: true };
  } catch (error) {
    console.error('Error confirming booking:', error);
    return { success: false, error: 'Failed to confirm booking' };
  }
}

// Release reservation (called when checkout is cancelled or expired)
export async function releaseReservation(sessionId: string, nightKey?: string): Promise<void> {
  if (nightKey) {
    const reservationKey = `reservation:${sessionId}:${nightKey}`;
    await kv.del(reservationKey);
  } else {
    // If no night key provided, try to find and delete all reservations for this session
    const pattern = `reservation:${sessionId}:*`;
    const keys = await kv.keys(pattern);
    for (const key of keys) {
      await kv.del(key);
    }
  }
}

// Clean up expired reservations (should be called periodically)
export async function cleanupExpiredReservations(): Promise<number> {
  const pattern = 'reservation:*';
  const keys = await kv.keys(pattern);

  const now = Date.now();
  let cleanedCount = 0;

  for (const key of keys) {
    const reservation = await kv.get<ReservationData>(key);
    if (reservation && (now - reservation.createdAt) >= RESERVATION_TIMEOUT_MS) {
      await kv.del(key);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

// Initialize inventory for all nights (admin use only)
export async function initializeInventory(): Promise<void> {
  for (const night of EVENT_NIGHTS) {
    const key = `inventory:${night.key}`;
    // Always overwrite to ensure fresh start for new dates
    await kv.set(key, {
      kid_tickets_sold: 0,
      adult_tickets_sold: 0,
    });
  }
}
