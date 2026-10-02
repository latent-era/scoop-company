// Order notifications for cake orders. Two independent, best-effort channels,
// each turned on only when its env vars are set, so nothing fires until the
// keys are in place, and a failure in one never blocks the Stripe webhook.

export interface CakeOrder {
  sessionId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  collectionDate: string;
  deliveryOption: string;
  orderSummary: string;
  totalAmount: string;
}

function orderLines(o: CakeOrder): string {
  return [
    `Name: ${o.customerName}`,
    o.customerEmail ? `Email: ${o.customerEmail}` : null,
    o.customerPhone ? `Phone: ${o.customerPhone}` : null,
    `${o.deliveryOption === 'delivery' ? 'Delivery' : 'Collection'} date: ${o.collectionDate}`,
    `Total: £${o.totalAmount}`,
    '',
    'Order:',
    o.orderSummary,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

// 1) Email the shop via Resend. No-op unless RESEND_API_KEY is set.
async function emailShop(o: CakeOrder): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.ORDER_NOTIFY_EMAIL || 'thescoopcompany1@gmail.com';
  // Must be a Resend-verified sender; onboarding@resend.dev works before the
  // domain is verified.
  const from = process.env.ORDER_NOTIFY_FROM || 'onboarding@resend.dev';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: o.customerEmail || undefined,
      subject: `New gelato cake order, ${o.customerName} (£${o.totalAmount})`,
      text: orderLines(o),
    }),
  });

  if (!res.ok) {
    console.error('Order email failed:', res.status, await res.text());
  }
}

// 2) Push the order into Scoop Inbox as a conversation, via its Forms webhook.
// No-op unless SCOOP_INBOX_URL and SCOOP_INBOX_FORMS_SECRET are set.
async function pushToScoopInbox(o: CakeOrder): Promise<void> {
  const base = process.env.SCOOP_INBOX_URL;
  const secret = process.env.SCOOP_INBOX_FORMS_SECRET;
  if (!base || !secret) return;

  const res = await fetch(`${base.replace(/\/$/, '')}/webhooks/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      name: o.customerName,
      email: o.customerEmail,
      subject: `Gelato cake order, £${o.totalAmount}`,
      message: orderLines(o),
      fields: {
        Phone: o.customerPhone || '',
        [o.deliveryOption === 'delivery' ? 'Delivery date' : 'Collection date']: o.collectionDate,
        Total: `£${o.totalAmount}`,
        'Stripe session': o.sessionId,
      },
    }),
  });

  if (!res.ok) {
    console.error('Scoop Inbox push failed:', res.status, await res.text());
  }
}

// Run both channels; never throw, so notification problems can't fail the order.
export async function notifyCakeOrder(order: CakeOrder): Promise<void> {
  const results = await Promise.allSettled([emailShop(order), pushToScoopInbox(order)]);
  for (const r of results) {
    if (r.status === 'rejected') console.error('Order notify error:', r.reason);
  }
}

// ── Cinema bookings ─────────────────────────────────────────────────────────
export interface CinemaBooking {
  showingKey: string;
  film: string;
  venue: string;
  onDate: string;    // 'YYYY-MM-DD'
  startTime: string; // 'HH:MM'
  whenLabel: string; // e.g. 'Sun 18 Oct, 3pm, Warlingham'
  name: string;
  email: string | null;
  phone: string | null;
  kids: number;
  adults: number;
  amountPence: number | null;
  stripeSession: string;
}

// Branded booking confirmation to the CUSTOMER (Stripe also sends a bare receipt).
async function emailCustomerCinema(b: CinemaBooking): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !b.email) return;
  const from = process.env.ORDER_NOTIFY_FROM || 'onboarding@resend.dev';
  const total = b.amountPence != null ? `£${(b.amountPence / 100).toFixed(2)}` : `£${((b.kids + b.adults) * 15).toFixed(2)}`;
  const people = `${b.kids} child${b.kids === 1 ? '' : 'ren'}${b.adults ? ` + ${b.adults} adult${b.adults === 1 ? '' : 's'}` : ''}`;
  const text = [
    `Hi ${b.name || 'there'},`,
    '',
    `You're booked in for a Scoop & Scream movie night. See you there!`,
    '',
    `Film: ${b.film}`,
    `When: ${b.whenLabel}`,
    `Party: ${people}`,
    `Paid: ${total} (any dessert and any drink included)`,
    '',
    `Please arrive 10 to 15 minutes before the film. General admission, so just come in and grab a spot.`,
    '',
    `The Scoop Company`,
  ].join('\n');
  const html = `<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#2A1A3D;max-width:520px">
    <p>Hi ${b.name || 'there'},</p>
    <p>You're booked in for a <b>Scoop &amp; Scream</b> movie night. See you there!</p>
    <table style="border-collapse:collapse;margin:14px 0">
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Film</td><td style="padding:4px 0;font-weight:700">${b.film}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">When</td><td style="padding:4px 0;font-weight:700">${b.whenLabel}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Party</td><td style="padding:4px 0">${people}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Paid</td><td style="padding:4px 0">${total} · any dessert and any drink included</td></tr>
    </table>
    <p>Please arrive 10 to 15 minutes before the film. General admission, so just come in and grab a spot.</p>
    <img src="https://www.thescoopcompanyevents.co.uk/images/email-logo.png" alt="The Scoop Company" width="260" style="width:260px;max-width:72%;height:auto;display:block;margin:22px 0 0;border-radius:8px">
  </div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [b.email], subject: `You're booked, ${b.film}, ${b.whenLabel}`, text, html }),
  });
  if (!res.ok) console.error('Cinema confirmation email failed:', res.status, await res.text());
}

// Heads-up to the shop inbox so the team sees every cinema booking as it lands,
// even before they open the CRM. Same inbox as cake orders.
async function emailShopCinema(b: CinemaBooking): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const to = process.env.ORDER_NOTIFY_EMAIL || 'thescoopcompany1@gmail.com';
  const from = process.env.ORDER_NOTIFY_FROM || 'onboarding@resend.dev';
  const total = b.amountPence != null ? `£${(b.amountPence / 100).toFixed(2)}` : `£${((b.kids + b.adults) * 15).toFixed(2)}`;
  const seats = b.kids + b.adults;
  const people = `${b.kids} child${b.kids === 1 ? '' : 'ren'}${b.adults ? ` + ${b.adults} adult${b.adults === 1 ? '' : 's'}` : ''}`;
  const text = [
    `New cinema booking`,
    '',
    `Film: ${b.film}`,
    `When: ${b.whenLabel}`,
    `Party: ${people} (${seats} seat${seats === 1 ? '' : 's'})`,
    `Paid: ${total}`,
    '',
    `Name: ${b.name || '(not given)'}`,
    `Email: ${b.email || '(not given)'}`,
    `Phone: ${b.phone || '(not given)'}`,
  ].join('\n');
  const html = `<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#2A1A3D;max-width:520px">
    <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#7A4AA6;margin:0 0 4px">New cinema booking</p>
    <p style="font-size:19px;font-weight:800;margin:0 0 12px">${b.film}, ${b.whenLabel}</p>
    <table style="border-collapse:collapse;margin:0 0 14px">
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Party</td><td style="padding:4px 0;font-weight:700">${people} · ${seats} seat${seats === 1 ? '' : 's'}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Paid</td><td style="padding:4px 0">${total}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Name</td><td style="padding:4px 0">${b.name || '(not given)'}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Email</td><td style="padding:4px 0">${b.email ? `<a href="mailto:${b.email}">${b.email}</a>` : '(not given)'}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6E635B">Phone</td><td style="padding:4px 0">${b.phone ? `<a href="tel:${b.phone.replace(/\s+/g, '')}">${b.phone}</a>` : '(not given)'}</td></tr>
    </table>
    <p style="color:#6E635B;font-size:13px">Also saved to the CRM under Events → Cinema nights.</p>
    <img src="https://www.thescoopcompanyevents.co.uk/images/email-logo.png" alt="The Scoop Company" width="220" style="width:220px;max-width:64%;height:auto;display:block;margin:20px 0 0;border-radius:8px">
  </div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: b.email || undefined, subject: `Cinema booking · ${b.film} · ${seats} seat${seats === 1 ? '' : 's'}`, text, html }),
  });
  if (!res.ok) console.error('Cinema shop email failed:', res.status, await res.text());
}

// Push the booking into Scoop Inbox's cinema roster (no conversation, no chase).
async function pushCinemaToInbox(b: CinemaBooking): Promise<void> {
  const base = process.env.SCOOP_INBOX_URL;
  const secret = process.env.SCOOP_INBOX_FORMS_SECRET;
  if (!base || !secret) return;
  const res = await fetch(`${base.replace(/\/$/, '')}/webhooks/cinema`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      showingKey: b.showingKey, film: b.film, venue: b.venue, onDate: b.onDate, startTime: b.startTime,
      name: b.name, email: b.email, phone: b.phone, kids: b.kids, adults: b.adults,
      amountPence: b.amountPence, stripeSession: b.stripeSession,
    }),
  });
  if (!res.ok) console.error('Cinema inbox push failed:', res.status, await res.text());
}

export async function notifyCinemaBooking(b: CinemaBooking): Promise<void> {
  const results = await Promise.allSettled([emailCustomerCinema(b), emailShopCinema(b), pushCinemaToInbox(b)]);
  for (const r of results) if (r.status === 'rejected') console.error('Cinema notify error:', r.reason);
}
