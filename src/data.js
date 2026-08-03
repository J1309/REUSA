// Mock listings. Only property-001 and property-002 have real photo sets in
// /public/images/properties — 003..006 reuse hero/lifestyle shots as placeholders
// until real assets land. Swap `images` here, nothing else needs to change.

export const properties = [
  {
    id: '001',
    title: 'The Garden House',
    price: 2450000,
    location: 'Montecito, California',
    type: 'Villa',
    beds: 4,
    baths: 3,
    sqft: 3200,
    year: 2019,
    featured: true,
    description:
      'A quiet, light-filled estate wrapped around a mature private garden. Full-height glazing folds the living room into the terrace, and the kitchen is built around a single slab island with an aged brass finish. Ten minutes from the coast, and a world away from it.',
    amenities: ['Private Garden', 'Chef Kitchen', 'Heated Pool', 'Wine Cellar', 'Solar Array', 'Two-Car Garage'],
    images: [
      '/images/properties/property-001-featured-garden.webp',
      '/images/properties/property-001-featured-living-room.webp',
      '/images/properties/property-001-featured-kitchen.webp',
    ],
  },
  {
    id: '002',
    title: 'Ridgeline Modern',
    price: 3180000,
    location: 'Austin, Texas',
    type: 'House',
    beds: 5,
    baths: 4,
    sqft: 4100,
    year: 2022,
    featured: true,
    description:
      'Sited along a limestone ridge with uninterrupted hill-country views. Warm oak and blackened steel throughout, a double-height entry, and a primary suite that opens onto its own shaded deck. Built to a 2022 energy spec with whole-home backup.',
    amenities: ['Hill Views', 'Home Office', 'Smart Home', 'Outdoor Kitchen', 'Backup Power', 'Gym'],
    images: [
      '/images/properties/property-002-featured-exterior.webp',
      '/images/properties/property-002-featured-interior.webp',
      '/images/properties/property-002-kitchen.webp',
      '/images/properties/property-002-bedroom.webp',
    ],
  },
  {
    id: '003',
    title: 'Coastal Villa No. 3',
    price: 4750000,
    location: 'Naples, Florida',
    type: 'Villa',
    beds: 5,
    baths: 5,
    sqft: 5200,
    year: 2021,
    featured: true,
    description:
      'Direct Gulf frontage with a forty-foot infinity edge facing due west. Three of the five bedrooms open to water. Deeded beach access and a private dock rated for a 38-foot vessel.',
    amenities: ['Ocean Front', 'Infinity Pool', 'Private Dock', 'Spa', 'Guest House', 'Elevator'],
    images: ['/images/hero/hero-02.webp', '/images/properties/property-001-featured-living-room.webp'],
  },
  {
    id: '004',
    title: 'The Wellington Residence',
    price: 1890000,
    location: 'Charleston, South Carolina',
    type: 'Townhouse',
    beds: 3,
    baths: 3,
    sqft: 2400,
    year: 2018,
    featured: false,
    description:
      'A restored downtown townhouse two blocks from the historic district. Original heart-pine floors, a rebuilt rear courtyard, and a top-floor study with harbor glimpses.',
    amenities: ['Courtyard', 'Historic District', 'Fireplace', 'Roof Deck', 'Walkable'],
    images: ['/images/hero/hero-01.webp', '/images/properties/property-002-featured-interior.webp'],
  },
  {
    id: '005',
    title: 'Parkside Family Home',
    price: 1250000,
    location: 'Portland, Oregon',
    type: 'House',
    beds: 4,
    baths: 3,
    sqft: 2850,
    year: 2016,
    featured: false,
    description:
      'Directly across from a twelve-acre park, in one of the strongest elementary catchments in the city. Open plan main floor, finished basement, and a west-facing yard that gets sun until eight in July.',
    amenities: ['Park Facing', 'Top Schools', 'Finished Basement', 'Fenced Yard', 'EV Charger'],
    images: ['/images/lifestyle/lifestyle-park-01.webp', '/images/lifestyle/lifestyle-school-01.webp'],
  },
  {
    id: '006',
    title: 'The Corner Loft',
    price: 980000,
    location: 'Denver, Colorado',
    type: 'Condo',
    beds: 2,
    baths: 2,
    sqft: 1600,
    year: 2020,
    featured: false,
    description:
      'A corner unit on the fifth floor with windows on two sides and a cafe at street level. Concrete ceilings, a compact but serious kitchen, and deeded parking.',
    amenities: ['Corner Unit', 'City Views', 'Concierge', 'Deeded Parking', 'Pet Friendly'],
    images: ['/images/lifestyle/lifestyle-cafe-01.webp', '/images/properties/property-002-kitchen.webp'],
  },
]

export const byId = (id) => properties.find((p) => p.id === id)

export const usd = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const propertyTypes = ['All', ...new Set(properties.map((p) => p.type))]

export const testimonials = [
  {
    quote:
      'We had been looking for eleven months on our own. Aurelia found the house in three weeks and negotiated eighty thousand off the ask.',
    name: 'Dana & Michael R.',
    place: 'Montecito, CA',
    stars: 5,
  },
  {
    quote:
      'They told us not to buy the first two houses we loved. That honesty is the whole reason we came back to sell with them four years later.',
    name: 'Priya S.',
    place: 'Austin, TX',
    stars: 5,
  },
  {
    quote:
      'Listed Thursday, six offers by Sunday, closed twelve percent over asking. The staging and photography made the difference.',
    name: 'Tom & Elise W.',
    place: 'Charleston, SC',
    stars: 5,
  },
]

export const stats = [
  { value: 1500, suffix: '+', label: 'Families placed' },
  { value: 520, suffix: '+', label: 'Properties sold' },
  { value: 18, suffix: ' yrs', label: 'In the market' },
  { value: 98, suffix: '%', label: 'List-to-sale ratio' },
]
