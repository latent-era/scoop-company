/** @type {import('next').NextConfig} */

// The four marketing pages ship as self-contained HTML in a separate design
// system, with a distinct file per screen size. They live in public/pages and
// are served at clean URLs here; a small script in each file picks desktop or
// mobile by width. The gelato cake site stays a normal Next.js app at /.
// `/cinema` has moved out of this list: it is sold on thescoopcompany.co.uk
// now, and the two sites counted seats separately — this one from its own KV
// store, the new one from Supabase, neither aware of the other. Two people
// could buy the last chair. The page file stays in public/pages, unserved, in
// case any of it is wanted again.
const MARKETING_PAGES = [
  { route: '/cart-hire', file: 'gelato-cart-hire' },
  { route: '/wholesale', file: 'gelato-by-maria-wholesale' },
  { route: '/menus', file: 'scoop-menus' },
  { route: '/careers', file: 'scoop-careers' },
];

const nextConfig = {
  async rewrites() {
    return MARKETING_PAGES.flatMap(({ route, file }) => [
      { source: route, destination: `/pages/${file}.html` },
      { source: `${route}/mobile`, destination: `/pages/${file}-mobile.html` },
    ]);
  },

  async redirects() {
    return [
      // Cinema tickets are sold on the new site. Everything that pointed here —
      // posts, printed cards, old links — lands on the page that can actually
      // take the money, rather than on a second till selling the same seats.
      //
      // Temporary (307) rather than permanent: a 308 is cached hard by the
      // browser and cannot be taken back, and the cinema is seasonal enough
      // that it may yet want its own page here again.
      {
        source: '/cinema',
        destination: 'https://thescoopcompany.co.uk/cinema',
        permanent: false,
      },
      {
        source: '/cinema/mobile',
        destination: 'https://thescoopcompany.co.uk/cinema',
        permanent: false,
      },

      // Printed QR codes point at /gelato-cake. The cake now opens the home page,
      // so this URL must keep working for every flyer already out there.
      // Deliberately temporary (307), not permanent (308): a 308 is cached hard by
      // the scanner's browser and can't be taken back if the cake ever moves.
      {
        source: '/gelato-cake',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
