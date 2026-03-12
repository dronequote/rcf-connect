export const CHURCH = {
  name: "The River Christian Fellowship",
  shortName: "The River",
  logo: "RCF",
  address: "4002 N 3300 E, Twin Falls, ID 83301",
  phone: "(208) 733-3133",
  officeHours: "Monday-Friday, 9 AM - 5 PM",
  pastor: "Tim Aulger",
  musicDirector: "Wade Nellermoe",
  prayerContact: { name: "Ron Price", phone: "208-650-8930" },
  donorPerfect: "https://wl.donorperfect.net/weblink/weblink.aspx?name=E347351&id=15",
  venmo: "@TheRiverCF",
  textToGive: "208-844-4328",
  featuredVerse:
    '"But the Lord stood at my side and gave me strength." — 2 Timothy 4:17',
  tagline:
    "A Bible-teaching, non-denominational church in Twin Falls, Idaho",
  social: {
    facebook: "https://www.facebook.com/therivertwinfalls",
    instagram: "https://www.instagram.com/theriverchristianfellowship/",
    youtube: "https://www.youtube.com/@TheRiverChristianFellowship/featured",
    tiktok: "https://www.tiktok.com/@theriverchristianfellowship",
  },
  googleMaps: "https://maps.app.goo.gl/qfsBrSpLFvJ9pBvD6",
} as const;

export const NESTJS_API = "https://api.leadprospecting.ai";
// TODO: Replace with actual GHL location ID once the sub-account is created
export const LOCATION_ID = process.env.NEXT_PUBLIC_GHL_LOCATION_ID || "";

export const EVENTS = {
  summer: [
    {
      name: "Church at the Lake",
      time: "Sunday Evenings · All Summer",
      desc: "Swimming → Food → Bible Study. Bring the whole family!",
    },
  ],
  upcoming: [
    {
      name: "Easter at The River",
      time: "Sunday, April 5",
      desc: "Join us to celebrate the Resurrection!",
      highlight: true,
    },
    {
      name: "3-Day Retreat",
      time: "Date Coming Soon",
      desc: "Get away. Go deeper. Grow together.",
      highlight: true,
    },
    {
      name: "Easter Candy Drive",
      time: "Next 2 Sundays",
      desc: "Drop off candy at the Connection Table",
      highlight: false,
    },
  ],
  weekly: [
    { day: "Sun", name: "Sunday Service", time: "10:00 AM & 6:00 PM", desc: "Praise & Prayer at 9:00 AM" },
    { day: "Tue", name: "Men's Dinner & Bible Study", time: "6:00 PM (1st & 3rd)", desc: "Fellowship and the Word" },
    { day: "Tue", name: "Women's Ministry", time: "6:00 PM (1st & 3rd)", desc: "Bible study & fellowship" },
    { day: "Wed", name: "Evening Bible Study", time: "6:00 PM", desc: "Open to all" },
    { day: "Thu", name: "Youth Worship Training", time: "6:30 PM", desc: "Grow in worship leadership" },
    { day: "Thu", name: "Youth Group", time: "7:00 PM", desc: "All Ages Bible Study at 7 PM too" },
    { day: "Fri", name: "Women's Afternoon Study", time: "1:00 PM", desc: "In the Fireside Room" },
    { day: "Daily", name: "P3: Proverbs, Praise & Prayer", time: "8:00 AM · The Farm House", desc: "Every single day" },
  ],
} as const;

export const INTEREST_TAGS = {
  new: [
    "Sunday Services",
    "Church at the Lake",
    "Bible Study",
    "Small Groups",
    "Kids Ministry",
    "Volunteering",
    "Prayer Support",
  ],
  involved: [
    "Women's Ministry",
    "Men's Ministry",
    "Youth Ministry",
    "Kids Ministry",
    "Worship Team",
    "Agape Meals Volunteer",
    "Food Pantry",
    "Tech & Media",
    "3-Day Retreat",
  ],
  families: [
    "Infant – 2nd Grade",
    "3rd – 12th Grade",
    "Youth Group (Thursdays)",
    "Youth Worship Training",
    "Family Bible Study",
    "Church at the Lake",
  ],
} as const;

export const GIVE_FUNDS = [
  { id: "general", label: "General Fund", desc: "Supports all ministries" },
  { id: "agape", label: "Agape Meals", desc: "Feed our community" },
  { id: "pantry", label: "Food Pantry", desc: "Stock the shelves" },
  { id: "missions", label: "Missions", desc: "Reach beyond Twin Falls" },
] as const;

export const GIVE_METHODS = [
  { id: "donorperfect", label: "Give Online", desc: "Secure giving via DonorPerfect" },
  { id: "venmo", label: "Venmo", desc: "@TheRiverCF" },
  { id: "text", label: "Text to Give", desc: 'Text "give" to 208-844-4328' },
  { id: "cash", label: "In Person", desc: "Cash/check via giving envelope" },
] as const;
