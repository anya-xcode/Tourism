/**
 * Development seed — loads sample places, travelers, reviews, threads and a
 * group visit into an EMPTY database so the UI has something to show.
 *
 *   npm run seed
 *
 * Refuses to run when the places collection already has documents.
 * All people below are synthetic sample accounts; photos are Unsplash images
 * of the actual landmark (or, for food spots, of the dish).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import Place from '../models/Place';
import Review from '../models/Review';
import Thread from '../models/Thread';
import ThreadReply from '../models/ThreadReply';
import VisitEvent from '../models/VisitEvent';
import VisitRSVP from '../models/VisitRSVP';
import { BudgetRange, PlaceCategory, RSVPStatus, EventVisibility } from '../types';

const DEMO_EMAIL = 'demo@travelexplorer.dev';
const DEMO_PASSWORD = 'explore123';

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1600`;

const travelers = [
  { name: 'Demo Explorer', email: DEMO_EMAIL, city: 'Pune' },
  { name: 'Aarav Mehta', email: 'aarav.sample@travelexplorer.dev', city: 'Mumbai' },
  { name: 'Isha Kulkarni', email: 'isha.sample@travelexplorer.dev', city: 'Delhi' },
  { name: 'Rohan Das', email: 'rohan.sample@travelexplorer.dev', city: 'Kolkata' },
  { name: 'Meera Pillai', email: 'meera.sample@travelexplorer.dev', city: 'Kochi' },
];

type SeedPlace = {
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  budgetRange: BudgetRange;
  operatingHours: string;
  suggestedDurationMinutes: number;
  tags: string[];
  photos: string[];
  description: string;
  addedBy: number; // index into travelers
  reviews: { by: number; rating: number; text: string }[];
};

const places: SeedPlace[] = [
  {
    name: 'Taj Mahal',
    city: 'Agra',
    address: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001',
    lat: 27.1751, lng: 78.0421,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.BUDGET,
    operatingHours: 'Sunrise – Sunset · closed Fridays',
    suggestedDurationMinutes: 180,
    tags: ['unesco', 'sunrise', 'mughal', 'marble'],
    photos: [img('1524492412937-b28074a5d7da'), img('1585135497273-1a86b09fe70e')],
    description:
      'The white-marble mausoleum Shah Jahan built for Mumtaz Mahal. Arrive at the east gate before sunrise: the queue is short and the marble turns pink, then gold. Walk the riverside terrace behind the tomb for the quietest view of the Yamuna.',
    addedBy: 2,
    reviews: [
      { by: 1, rating: 5, text: 'Went at sunrise on a weekday. Worth every minute of the early alarm. The inlay work up close is unreal.' },
      { by: 3, rating: 4, text: 'Stunning, but crowded by 9 am. Hire a guide at the gate only if they show you their ASI licence.' },
    ],
  },
  {
    name: 'Gateway of India',
    city: 'Mumbai',
    address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
    lat: 18.922, lng: 72.8347,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.FREE,
    operatingHours: 'Open all day',
    suggestedDurationMinutes: 45,
    tags: ['waterfront', 'colaba', 'ferries', 'evening'],
    photos: [img('1570168007204-dfb528c6958f'), img('1529253355930-ddbe423a2ac7'), img('1580581096469-8afb38d3dbd5')],
    description:
      'The basalt arch on the Apollo Bunder waterfront, finished in 1924. Ferries to Elephanta Caves leave from the jetty beside it. Come after the rain for the reflections, then walk to Colaba Causeway for dinner.',
    addedBy: 1,
    reviews: [
      { by: 2, rating: 4, text: 'Best right after a monsoon shower — the plaza turns into a mirror. Very busy on weekends.' },
      { by: 4, rating: 5, text: 'Took the morning Elephanta ferry from here. Get tickets at the jetty, not from touts.' },
    ],
  },
  {
    name: 'Marine Drive Promenade',
    city: 'Mumbai',
    address: 'Netaji Subhash Chandra Bose Road, Churchgate, Mumbai 400020',
    lat: 18.944, lng: 72.823,
    category: PlaceCategory.NATURE, budgetRange: BudgetRange.FREE,
    operatingHours: 'Open all day',
    suggestedDurationMinutes: 60,
    tags: ['sunset', 'sea-face', 'walk', 'free'],
    photos: [img('1567157577867-05ccb1388e66')],
    description:
      'Three kilometres of sea wall curving from Nariman Point to Girgaum Chowpatty. Locals call it the Queen’s Necklace for the way the streetlights trace the bay at night. Bring nothing but time.',
    addedBy: 1,
    reviews: [
      { by: 3, rating: 5, text: 'Sat on the wall for two hours watching the sunset. Cutting chai from the cyclists is a must.' },
    ],
  },
  {
    name: 'Fort Heritage Precinct',
    city: 'Mumbai',
    address: 'Mahapalika Marg, Fort, Mumbai, Maharashtra 400001',
    lat: 18.9398, lng: 72.8355,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.FREE,
    operatingHours: 'Best 7:00 AM – 10:00 AM',
    suggestedDurationMinutes: 90,
    tags: ['architecture', 'gothic', 'walking-tour', 'photography'],
    photos: [img('1566552881560-0be862a7c445')],
    description:
      'A walk through the Victorian Gothic core of south Mumbai: the BMC headquarters, CSMT station across the road, and the Kala Ghoda art district a few lanes south. Early mornings are calm and the light is kind to the stone.',
    addedBy: 2,
    reviews: [],
  },
  {
    name: 'India Gate & Kartavya Path',
    city: 'Delhi',
    address: 'Kartavya Path, India Gate, New Delhi, Delhi 110001',
    lat: 28.6129, lng: 77.2295,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.FREE,
    operatingHours: 'Open all day · lit after dark',
    suggestedDurationMinutes: 60,
    tags: ['memorial', 'evening', 'lawns', 'free'],
    photos: [img('1587474260584-136574528ed5')],
    description:
      'The war memorial arch at the end of Kartavya Path, inscribed with the names of Indian soldiers of the First World War. Families picnic on the lawns in the evening; the National War Memorial is a short walk away.',
    addedBy: 2,
    reviews: [
      { by: 0, rating: 4, text: 'Lovely in the evening when it is lit up. Ice-cream carts everywhere. Parking is a pain — take the metro.' },
    ],
  },
  {
    name: 'Humayun’s Tomb',
    city: 'Delhi',
    address: 'Mathura Road, Nizamuddin East, New Delhi, Delhi 110013',
    lat: 28.5933, lng: 77.2507,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.BUDGET,
    operatingHours: 'Sunrise – Sunset',
    suggestedDurationMinutes: 120,
    tags: ['unesco', 'mughal', 'gardens', 'quiet'],
    photos: [img('1597040663342-45b6af3d91a5')],
    description:
      'The garden tomb that set the template the Taj Mahal later perfected. Far calmer than Agra, with a charbagh garden laid out in four quarters. Pair it with an evening qawwali at Nizamuddin Dargah nearby.',
    addedBy: 2,
    reviews: [
      { by: 3, rating: 5, text: 'Honestly preferred it to the Taj — you can actually sit in the gardens in peace.' },
      { by: 4, rating: 5, text: 'Golden hour from the south lawn. Bring water, there is a lot of walking.' },
    ],
  },
  {
    name: 'Chandni Chowk Food Lanes',
    city: 'Delhi',
    address: 'Chandni Chowk, Old Delhi, Delhi 110006',
    lat: 28.6562, lng: 77.2303,
    category: PlaceCategory.FOOD, budgetRange: BudgetRange.BUDGET,
    operatingHours: '10:00 AM – 10:00 PM',
    suggestedDurationMinutes: 150,
    tags: ['street-food', 'samosa', 'old-delhi', 'crawl'],
    photos: [img('1601050690597-df0568f70950'), img('1585937421612-70a008356fbe')],
    description:
      'A food crawl through the lanes off Chandni Chowk: samosas and kachori in the morning, parathas in Paranthe Wali Gali, curries near Jama Masjid in the evening. Go hungry, go with cash, and take the metro to the Chandni Chowk station.',
    addedBy: 3,
    reviews: [
      { by: 1, rating: 5, text: 'Ate my way down the whole lane. Start early — the best kachori stalls sell out by noon.' },
      { by: 0, rating: 4, text: 'Overwhelming in the best way. Wear shoes you do not mind getting dusty.' },
    ],
  },
  {
    name: 'Hawa Mahal',
    city: 'Jaipur',
    address: 'Hawa Mahal Road, Badi Choupad, Jaipur, Rajasthan 302002',
    lat: 26.9239, lng: 75.8267,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.BUDGET,
    operatingHours: '9:00 AM – 4:30 PM',
    suggestedDurationMinutes: 60,
    tags: ['pink-city', 'rajput', 'facade', 'photography'],
    photos: [img('1477587458883-47145ed94245')],
    description:
      'The honeycomb façade of the Palace of Winds, built so royal women could watch street life unseen through its latticed windows. The best view of the front is from the rooftop cafés across the road, around 8 am.',
    addedBy: 4,
    reviews: [
      { by: 2, rating: 4, text: 'The view from the café opposite beats going inside. Go early before the tour buses.' },
    ],
  },
  {
    name: 'Alleppey Backwater Houseboats',
    city: 'Alappuzha',
    address: 'Finishing Point, Punnamada, Alappuzha, Kerala 688013',
    lat: 9.4981, lng: 76.3388,
    category: PlaceCategory.NATURE, budgetRange: BudgetRange.PREMIUM,
    operatingHours: 'Check-in 12:00 PM · check-out 9:00 AM',
    suggestedDurationMinutes: 1260,
    tags: ['houseboat', 'overnight', 'kerala', 'slow-travel'],
    photos: [img('1593693397690-362cb9666fc2'), img('1602216056096-3b40cc0c9944')],
    description:
      'An overnight kettuvallam cruise through palm-lined canals and paddy fields below sea level. Meals are cooked on board — ask for karimeen fry. Boats moor for the night, so the evening is all birdsong and village lamps.',
    addedBy: 4,
    reviews: [
      { by: 3, rating: 5, text: 'Most relaxing night of the trip. Check the boat in person before paying; quality varies a lot.' },
      { by: 1, rating: 4, text: 'Beautiful, but the main lake gets busy. Ask the crew to take the narrow canals.' },
    ],
  },
  {
    name: 'Kumarakom Village Canoe Trail',
    city: 'Kumarakom',
    address: 'Kumarakom, Kottayam, Kerala 686563',
    lat: 9.6175, lng: 76.4301,
    category: PlaceCategory.ADVENTURE, budgetRange: BudgetRange.MODERATE,
    operatingHours: '6:00 AM – 9:00 AM · 4:00 PM – 6:30 PM',
    suggestedDurationMinutes: 150,
    tags: ['canoe', 'birding', 'sunrise', 'village'],
    photos: [img('1506461883276-594a12b11cf3'), img('1590050752117-238cb0fb12b1')],
    description:
      'A hand-paddled country canoe through the narrow canals the houseboats cannot reach. Early mornings bring kingfishers and egrets; evenings end with toddy-shop snacks on the bank.',
    addedBy: 4,
    reviews: [],
  },
  {
    name: 'Golden Temple (Harmandir Sahib)',
    city: 'Amritsar',
    address: 'Golden Temple Road, Atta Mandi, Amritsar, Punjab 143006',
    lat: 31.62, lng: 74.8765,
    category: PlaceCategory.RELIGIOUS, budgetRange: BudgetRange.FREE,
    operatingHours: 'Open all day',
    suggestedDurationMinutes: 180,
    tags: ['langar', 'night', 'sikh', 'free'],
    photos: [img('1514222134-b57cbb8ce073')],
    description:
      'The gilded gurdwara in the middle of the Amrit Sarovar. Cover your head, leave shoes at the free counter, and eat at the langar — the community kitchen feeds everyone who comes, around the clock. Return after dark when the temple glows on the water.',
    addedBy: 3,
    reviews: [
      { by: 4, rating: 5, text: 'Volunteered in the langar kitchen for an hour. The most generous place I have ever been.' },
      { by: 2, rating: 5, text: 'Visit twice: once at dawn, once at night. Completely different moods.' },
    ],
  },
  {
    name: 'Victoria Memorial',
    city: 'Kolkata',
    address: 'Victoria Memorial Hall, 1 Queens Way, Maidan, Kolkata, West Bengal 700071',
    lat: 22.5448, lng: 88.3426,
    category: PlaceCategory.HERITAGE, budgetRange: BudgetRange.BUDGET,
    operatingHours: 'Gardens 5:30 AM – 6:15 PM · museum closed Mondays',
    suggestedDurationMinutes: 120,
    tags: ['museum', 'gardens', 'marble', 'maidan'],
    photos: [img('1558431382-27e303142255')],
    description:
      'A white-marble hall on the edge of the Maidan, now a museum of colonial-era Kolkata. The gardens are where the city jogs at dawn. Walk to Park Street afterwards for a long lunch.',
    addedBy: 3,
    reviews: [
      { by: 0, rating: 4, text: 'Gardens are gorgeous at 6 am. Museum galleries are a bit dusty but worth an hour.' },
    ],
  },
];

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-explorer';
  await mongoose.connect(uri);
  const dbName = mongoose.connection.db?.databaseName;

  const existing = await Place.countDocuments();
  if (existing > 0) {
    // Backfill the sample flag on accounts an earlier seed created, so their contributions stay labeled
    const marked = await User.updateMany(
      { email: { $in: travelers.map((t) => t.email) }, isSample: { $ne: true } },
      { $set: { isSample: true } }
    );
    if (marked.modifiedCount) console.log(`Marked ${marked.modifiedCount} seeded accounts as sample.`);
    console.log(`Database "${dbName}" already has ${existing} places — seed skipped (it only runs on an empty database).`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Seeding "${dbName}"…`);

  // Travelers — only the demo account gets a known password
  const users = [];
  for (const t of travelers) {
    const plain = t.email === DEMO_EMAIL ? DEMO_PASSWORD : crypto.randomBytes(16).toString('hex');
    const password = await bcrypt.hash(plain, 10);
    const user = await User.findOneAndUpdate(
      { email: t.email },
      { $setOnInsert: { name: t.name, email: t.email, city: t.city, password, isSample: true } },
      { upsert: true, new: true }
    );
    users.push(user!);
  }

  const day = 24 * 60 * 60 * 1000;
  let placeCount = 0;
  let reviewCount = 0;
  const created: Record<string, mongoose.Types.ObjectId> = {};

  for (const [i, p] of places.entries()) {
    const place = await Place.create({
      name: p.name,
      description: p.description,
      location: { type: 'Point', coordinates: [p.lng, p.lat] },
      address: p.address,
      city: p.city,
      category: p.category,
      budgetRange: p.budgetRange,
      operatingHours: p.operatingHours,
      suggestedDurationMinutes: p.suggestedDurationMinutes,
      tags: p.tags,
      photos: p.photos,
      addedBy: users[p.addedBy]._id,
      // Stagger creation dates so "newest" sorting is meaningful
      createdAt: new Date(Date.now() - (places.length - i) * 2 * day),
    });
    created[p.name] = place._id as mongoose.Types.ObjectId;
    placeCount++;

    for (const [j, r] of p.reviews.entries()) {
      await Review.create({
        userId: users[r.by]._id,
        placeId: place._id,
        rating: r.rating,
        text: r.text,
        visitDate: new Date(Date.now() - (20 + j * 7) * day),
      });
      reviewCount++;
    }
    if (p.reviews.length) {
      const avg = p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;
      await Place.findByIdAndUpdate(place._id, {
        averageRating: Math.round(avg * 10) / 10,
        totalReviews: p.reviews.length,
      });
    }
  }

  // Community threads
  const thread = await Thread.create({
    placeId: created['Taj Mahal'],
    userId: users[1]._id,
    content: 'Is the east gate or the west gate quicker at sunrise? Planning a trip on a Saturday.',
  });
  await ThreadReply.create({
    threadId: thread._id,
    userId: users[2]._id,
    content: 'East gate. Buy the ticket online the night before and you skip the first queue entirely.',
  });
  await Thread.create({
    placeId: created['Golden Temple (Harmandir Sahib)'],
    userId: users[4]._id,
    content: 'Anyone know if the langar accepts volunteers for a single morning shift? Visiting next month.',
  });

  // An upcoming open group visit
  const event = await VisitEvent.create({
    placeId: created['Humayun’s Tomb'],
    creatorId: users[2]._id,
    title: 'Golden-hour photo walk',
    description: 'Slow walk around the gardens before closing, then chai outside the gate. Any camera welcome — phones too.',
    scheduledDate: new Date(Date.now() + 10 * day),
    time: '16:30',
    maxParticipants: 8,
    visibility: EventVisibility.OPEN,
  });
  for (const u of [users[2], users[3]]) {
    await VisitRSVP.create({ eventId: event._id, userId: u._id, status: RSVPStatus.GOING });
  }

  console.log(`Done: ${users.length} travelers, ${placeCount} places, ${reviewCount} reviews, 2 threads, 1 group visit.`);
  console.log(`Demo login → ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
