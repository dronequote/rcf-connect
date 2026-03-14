/**
 * Seed script for RCF MongoDB collections.
 *
 * Reads constants from lib/constants.ts data and inserts into all rcf* collections
 * in the `lpai` database.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." npx tsx scripts/seed-mongodb.ts
 *
 * Or set MONGODB_URI in your environment.
 */

import { MongoClient } from 'mongodb';

// ─── Data (mirrors lib/constants.ts) ───

const CHURCH = {
  name: 'The River Christian Fellowship',
  shortName: 'The River',
  logo: 'RCF',
  address: '4002 N 3300 E, Twin Falls, ID 83301',
  phone: '(208) 733-3133',
  officeHours: 'Monday-Friday, 9 AM - 5 PM',
  pastor: 'Tim Aulger',
  musicDirector: 'Wade Nellermoe',
  prayerContact: { name: 'Ron Price', phone: '208-650-8930' },
  donorPerfect: 'https://wl.donorperfect.net/weblink/weblink.aspx?name=E347351&id=15',
  venmo: '@TheRiverCF',
  textToGive: '208-844-4328',
  featuredVerse: '"But the Lord stood at my side and gave me strength." — 2 Timothy 4:17',
  tagline: 'A Bible-teaching, non-denominational church in Twin Falls, Idaho',
  social: {
    facebook: 'https://www.facebook.com/therivertwinfalls',
    instagram: 'https://www.instagram.com/theriverchristianfellowship/',
    youtube: 'https://www.youtube.com/@TheRiverChristianFellowship/featured',
    tiktok: 'https://www.tiktok.com/@theriverchristianfellowship',
  },
  googleMaps: 'https://maps.app.goo.gl/qfsBrSpLFvJ9pBvD6',
};

const EVENTS = {
  summer: [
    { name: 'Church at the Lake', time: 'Sunday Evenings · All Summer', desc: 'Swimming → Food → Bible Study. Bring the whole family!' },
  ],
  upcoming: [
    { name: 'Easter at The River', time: 'Sunday, April 5', desc: 'Join us to celebrate the Resurrection!', highlight: true },
    { name: '3-Day Retreat', time: 'Date Coming Soon', desc: 'Get away. Go deeper. Grow together.', highlight: true },
    { name: 'Easter Candy Drive', time: 'Next 2 Sundays', desc: 'Drop off candy at the Connection Table', highlight: false },
  ],
  weekly: [
    { day: 'Sun', name: 'Sunday Service', time: '10:00 AM & 6:00 PM', desc: 'Praise & Prayer at 9:00 AM' },
    { day: 'Tue', name: "Men's Dinner & Bible Study", time: '6:00 PM (1st & 3rd)', desc: 'Fellowship and the Word' },
    { day: 'Tue', name: "Women's Ministry", time: '6:00 PM (1st & 3rd)', desc: 'Bible study & fellowship' },
    { day: 'Wed', name: 'Evening Bible Study', time: '6:00 PM', desc: 'Open to all' },
    { day: 'Thu', name: 'Youth Worship Training', time: '6:30 PM', desc: 'Grow in worship leadership' },
    { day: 'Thu', name: 'Youth Group', time: '7:00 PM', desc: 'All Ages Bible Study at 7 PM too' },
    { day: 'Fri', name: "Women's Afternoon Study", time: '1:00 PM', desc: 'In the Fireside Room' },
    { day: 'Daily', name: 'P3: Proverbs, Praise & Prayer', time: '8:00 AM · The Farm House', desc: 'Every single day' },
  ],
};

const INTEREST_TAGS = {
  new: ['Sunday Services', 'Church at the Lake', 'Bible Study', 'Small Groups', 'Kids Ministry', 'Volunteering', 'Prayer Support'],
  involved: ["Women's Ministry", "Men's Ministry", 'Youth Ministry', 'Kids Ministry', 'Worship Team', 'Agape Meals Volunteer', 'Food Pantry', 'Tech & Media', '3-Day Retreat'],
  families: ['Infant – 2nd Grade', '3rd – 12th Grade', 'Youth Group (Thursdays)', 'Youth Worship Training', 'Family Bible Study', 'Church at the Lake'],
};

const GIVE_FUNDS = [
  { id: 'general', label: 'General Fund', desc: 'Supports all ministries', active: true },
  { id: 'agape', label: 'Agape Meals', desc: 'Feed our community', active: true },
  { id: 'pantry', label: 'Food Pantry', desc: 'Stock the shelves', active: true },
  { id: 'missions', label: 'Missions', desc: 'Reach beyond Twin Falls', active: true },
];

const GIVE_METHODS = [
  { id: 'donorperfect', label: 'Give Online', desc: 'Secure giving via DonorPerfect', active: true },
  { id: 'venmo', label: 'Venmo', desc: '@TheRiverCF', active: true },
  { id: 'text', label: 'Text to Give', desc: 'Text "give" to 208-844-4328', active: true },
  { id: 'cash', label: 'In Person', desc: 'Cash/check via giving envelope', active: true },
];

const SERMONS = [
  {
    id: 's1',
    title: 'Standing Firm in the Storm',
    speaker: 'Tim Aulger',
    date: 'March 9, 2026',
    duration: '42 min',
    verse: '2 Timothy 4:17',
    youtubeUrl: 'https://youtube.com/@TheRiverChristianFellowship',
    summary: {
      themes: ['Faith under pressure', "God's faithfulness", 'Perseverance'],
      mainMessage: "When life's storms hit — and they will — God doesn't promise to remove the storm. He promises to stand with you in it. Paul wrote from a Roman prison, abandoned by friends, facing execution. Yet he said 'the Lord stood at my side and gave me strength.' That's not denial. That's faith forged in fire.",
      scriptures: ['2 Timothy 4:16-18', 'Psalm 46:1-3', 'Isaiah 43:2', 'Romans 8:28'],
    },
    questions: [
      "When have you experienced God's presence in a difficult season?",
      "Paul said 'everyone deserted me.' How do we handle spiritual loneliness?",
      "What does it look like practically to 'stand firm' in your current situation?",
      "How does Paul's perspective on suffering differ from our cultural expectations?",
      "What storm are you facing right now where you need to trust God's strength?",
    ],
    devotionals: [
      { day: 'Monday', title: 'The God Who Stands With You', scripture: '2 Timothy 4:17', prompt: "Read Paul's words slowly. Where in your life do you need God to 'stand at your side' today? Write it down and pray over it." },
      { day: 'Tuesday', title: 'Refuge and Strength', scripture: 'Psalm 46:1-3', prompt: "Even when the earth gives way — what is your 'earth giving way' moment? How does knowing God is your refuge change your response?" },
      { day: 'Wednesday', title: 'Through the Waters', scripture: 'Isaiah 43:2', prompt: "God says 'when you pass through the waters, I will be with you.' Notice He says 'when,' not 'if.' How does this prepare you?" },
      { day: 'Thursday', title: 'All Things Together', scripture: 'Romans 8:28', prompt: 'This verse is often quoted. Today, instead of applying it to others, apply it to your hardest current situation.' },
      { day: 'Friday', title: "Delivered from the Lion's Mouth", scripture: '2 Timothy 4:18', prompt: "Paul trusted God for deliverance — not from death, but through it. What does 'deliverance' look like for you right now?" },
    ],
    kidsVersion: "Did you know that Paul was one of God's bravest helpers? He traveled everywhere telling people about Jesus. Sometimes people were mean to him, and once he was even put in jail! But even in jail, Paul wasn't scared. He said, 'God is standing right next to me and giving me super strength!' Just like when you feel scared at night and your mom or dad sits with you — God does that for us ALL the time. Even when things are hard, God never leaves.",
    quote: 'The Lord stood at my side and gave me strength.',
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 's2',
    title: 'The Heart of Worship',
    speaker: 'Tim Aulger',
    date: 'March 2, 2026',
    duration: '38 min',
    verse: 'John 4:24',
    youtubeUrl: 'https://youtube.com/@TheRiverChristianFellowship',
    summary: {
      themes: ['True worship', 'Spirit and truth', 'Surrender'],
      mainMessage: "Worship isn't about the music style or the building. Jesus told the woman at the well that true worshipers worship in spirit and in truth. It's about the posture of your heart, not the position of your hands.",
      scriptures: ['John 4:23-24', 'Psalm 95:1-7', 'Romans 12:1'],
    },
    questions: [
      "What does 'worshiping in spirit and truth' mean to you practically?",
      'How do you worship outside of Sunday mornings?',
      'What distracts you most from genuine worship?',
    ],
    devotionals: [],
    kidsVersion: '',
    quote: 'God is spirit, and his worshipers must worship in the Spirit and in truth.',
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 's3',
    title: 'Built to Last',
    speaker: 'Tim Aulger',
    date: 'February 23, 2026',
    duration: '45 min',
    verse: 'Matthew 7:24-27',
    youtubeUrl: 'https://youtube.com/@TheRiverChristianFellowship',
    summary: {
      themes: ['Foundation of faith', 'Obedience', 'Wisdom vs. foolishness'],
      mainMessage: "Everyone's life will face storms. The question isn't whether the storm comes — it's what you've built on. Jesus said the wise man builds on the rock. That rock is hearing His words AND putting them into practice.",
      scriptures: ['Matthew 7:24-27', 'Psalm 127:1', '1 Corinthians 3:11'],
    },
    questions: [],
    devotionals: [],
    kidsVersion: '',
    quote: 'The rain came down, the streams rose, and the winds blew — yet it did not fall.',
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_MEMBER = {
  id: 'm1',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  email: 'sarah.m@example.com',
  phone: '(208) 555-0142',
  avatar: 'SM',
  role: 'member',
  family: {
    name: 'The Mitchell Family',
    members: [
      { name: 'Sarah Mitchell', role: 'Parent' },
      { name: 'James Mitchell', role: 'Parent' },
      { name: 'Emma Mitchell', age: 8, grade: '2nd Grade', ministry: 'Infant – 2nd Grade', room: 'East Hall' },
      { name: 'Noah Mitchell', age: 12, grade: '6th Grade', ministry: '3rd – 12th Grade', room: 'Youth Room' },
    ],
  },
  groups: ["Women's Ministry", 'Sunday Service Volunteer', 'Small Group – Tuesdays'],
  notifications: { email: true, sms: true, prayerDigest: true },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_GIVING_HISTORY = [
  { date: 'Mar 9, 2026', amount: 100, fund: 'General Fund', method: 'DonorPerfect', memberId: 'm1' },
  { date: 'Mar 2, 2026', amount: 50, fund: 'Agape Meals', method: 'Venmo', memberId: 'm1' },
  { date: 'Feb 23, 2026', amount: 100, fund: 'General Fund', method: 'DonorPerfect', memberId: 'm1' },
  { date: 'Feb 16, 2026', amount: 25, fund: 'Food Pantry', method: 'Text to Give', memberId: 'm1' },
  { date: 'Feb 9, 2026', amount: 100, fund: 'General Fund', method: 'DonorPerfect', memberId: 'm1' },
  { date: 'Feb 2, 2026', amount: 75, fund: 'Missions', method: 'DonorPerfect', memberId: 'm1' },
];

const MOCK_VISITORS = [
  { id: 'v1', name: 'Carlos Rivera', email: 'carlos.r@example.com', phone: '(208) 555-0198', interests: ['Sunday Services', 'Small Groups', "Men's Ministry"], source: 'QR Scan', date: 'Mar 9, 2026', status: 'new' },
  { id: 'v2', name: 'Anna Foster', email: 'anna.f@example.com', phone: '(208) 555-0234', interests: ['Kids Ministry', "Women's Ministry", 'Church at the Lake'], source: 'Website', date: 'Mar 9, 2026', status: 'new' },
  { id: 'v3', name: 'David Kim', email: 'david.k@example.com', phone: '(208) 555-0167', interests: ['Bible Study', 'Volunteering'], source: 'QR Scan', date: 'Mar 2, 2026', status: 'following_up' },
  { id: 'v4', name: 'Maria Santos', email: 'maria.s@example.com', phone: '(208) 555-0345', interests: ['Youth Ministry', 'Worship Team'], source: 'Referral', date: 'Feb 23, 2026', status: 'connected' },
  { id: 'v5', name: 'Jake Thompson', email: 'jake.t@example.com', phone: '(208) 555-0456', interests: ['Sunday Services', 'Prayer Support'], source: 'Walk-in', date: 'Feb 16, 2026', status: 'regular' },
  { id: 'v6', name: 'Emily Chen', email: 'emily.c@example.com', phone: '(208) 555-0567', interests: ["Women's Ministry", 'Small Groups', 'Food Pantry'], source: 'QR Scan', date: 'Feb 9, 2026', status: 'following_up' },
];

const MOCK_STATS = {
  newVisitorsThisWeek: 4,
  agapeDonationsThisMonth: 2850,
  qrScansThisSunday: 23,
  activeMembers: 127,
  mealsServed: 890,
  mealsGoal: 5000,
  fbCheckinsToday: 18,
  fbPageLikes: 342,
};

const STAFF = [
  {
    email: 'taulger@gmail.com',
    firstName: 'Tim',
    lastName: 'Aulger',
    role: 'superadmin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'sinuhe@leadprospecting.ai',
    firstName: 'Sinuhe',
    lastName: 'Montoya',
    role: 'superadmin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ─── Seed ───

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Set MONGODB_URI environment variable');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('lpai');
    console.log('✅ Connected to MongoDB (lpai database)');

    // 1. rcfStaff
    await db.collection('rcfStaff').deleteMany({});
    await db.collection('rcfStaff').insertMany(STAFF);
    console.log(`  ✓ rcfStaff: ${STAFF.length} records`);

    // 2. rcfMembers
    await db.collection('rcfMembers').deleteMany({});
    await db.collection('rcfMembers').insertOne(MOCK_MEMBER);
    console.log('  ✓ rcfMembers: 1 record');

    // 3. rcfSermons
    await db.collection('rcfSermons').deleteMany({});
    await db.collection('rcfSermons').insertMany(SERMONS);
    console.log(`  ✓ rcfSermons: ${SERMONS.length} records`);

    // 4. rcfEvents (single document)
    await db.collection('rcfEvents').deleteMany({});
    await db.collection('rcfEvents').insertOne({
      _id: 'events' as any,
      ...EVENTS,
      updatedAt: new Date(),
    });
    console.log('  ✓ rcfEvents: 1 document');

    // 5. rcfGivingFunds
    await db.collection('rcfGivingFunds').deleteMany({});
    await db.collection('rcfGivingFunds').insertMany(GIVE_FUNDS);
    console.log(`  ✓ rcfGivingFunds: ${GIVE_FUNDS.length} records`);

    // 6. rcfGivingMethods
    await db.collection('rcfGivingMethods').deleteMany({});
    await db.collection('rcfGivingMethods').insertMany(GIVE_METHODS);
    console.log(`  ✓ rcfGivingMethods: ${GIVE_METHODS.length} records`);

    // 7. rcfGiving (giving history)
    await db.collection('rcfGiving').deleteMany({});
    await db.collection('rcfGiving').insertMany(MOCK_GIVING_HISTORY);
    console.log(`  ✓ rcfGiving: ${MOCK_GIVING_HISTORY.length} records`);

    // 8. rcfCheckins (visitors)
    await db.collection('rcfCheckins').deleteMany({});
    await db.collection('rcfCheckins').insertMany(MOCK_VISITORS);
    console.log(`  ✓ rcfCheckins: ${MOCK_VISITORS.length} records`);

    // 9. rcfSettings (key-value store)
    await db.collection('rcfSettings').deleteMany({});
    const settingsEntries = Object.entries(CHURCH).map(([key, value]) => ({
      key,
      value,
      updatedAt: new Date(),
    }));
    // Add dashboard stats
    settingsEntries.push({ key: 'dashboardStats', value: MOCK_STATS as any, updatedAt: new Date() });
    // Add interest tags
    settingsEntries.push({ key: 'interestTags', value: INTEREST_TAGS as any, updatedAt: new Date() });
    await db.collection('rcfSettings').insertMany(settingsEntries);
    console.log(`  ✓ rcfSettings: ${settingsEntries.length} entries`);

    // 10. Create empty collections (for future use)
    const emptyCollections = ['rcfBulletins', 'rcfPrayerRequests', 'rcfAgapeCheckins', 'rcfSchedule'];
    for (const name of emptyCollections) {
      const exists = await db.listCollections({ name }).hasNext();
      if (!exists) {
        await db.createCollection(name);
      }
      console.log(`  ✓ ${name}: ready`);
    }

    console.log('\n🎉 Seed complete! All rcf* collections populated.');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
