/**
 * Structured help content for the admin UI.
 * Each section maps to an admin route and has role-filtered content.
 *
 * - "superadmin" content: full technical details (API routes, data flow, architecture)
 * - "admin" content: operational guidance (how to use the feature, workflows)
 * - "all" content: shown to both roles
 */

export interface HelpEntry {
  /** Unique key matching the admin route (e.g. "dashboard", "visitors") */
  section: string;
  /** Route this help is associated with */
  route: string;
  /** Display title */
  title: string;
  /** Icon for the help card */
  icon: string;
  /** Operational guidance shown to all staff */
  overview: string;
  /** Step-by-step workflow tips */
  steps: string[];
  /** Technical details only shown to super-admins */
  technical?: {
    /** How data flows for this feature */
    dataFlow: string;
    /** Relevant API endpoints */
    apiRoutes: { method: string; path: string; desc: string }[];
    /** MongoDB collections involved */
    collections: string[];
    /** Additional architecture notes */
    notes?: string;
  };
}

export const helpContent: HelpEntry[] = [
  // ─── Dashboard ───
  {
    section: "dashboard",
    route: "/admin",
    title: "Dashboard",
    icon: "📊",
    overview:
      "Your command center. See key metrics at a glance — new visitors this week, agape meal donations, QR code scans, and total active members. Recent visitors appear below the stats so you can quickly follow up.",
    steps: [
      "Check the stats cards each week for trends in visitor traffic and giving.",
      "Click a recent visitor card to jump to their full record in Visitor Management.",
      "Use the Quick Actions grid to navigate to any admin tool.",
      "The 'Member View' link lets you preview what congregation members see.",
    ],
    technical: {
      dataFlow:
        "Stats are fetched server-side from `rcfSettings` (key: 'dashboardStats'). Visitors come from `rcfCheckins` sorted by date. Both pass as props to AdminDashboardClient.",
      apiRoutes: [
        { method: "GET", path: "/api/admin/stats", desc: "Fetch dashboard statistics" },
        { method: "PUT", path: "/api/admin/stats", desc: "Update individual stat values" },
        { method: "GET", path: "/api/admin/visitors", desc: "Fetch all visitors" },
      ],
      collections: ["rcfSettings", "rcfCheckins"],
      notes:
        "Stats update automatically when agape check-ins are logged (mealsServed increments). Other stats currently update via direct API calls.",
    },
  },

  // ─── Visitors ───
  {
    section: "visitors",
    route: "/admin/visitors",
    title: "Visitor Management",
    icon: "👥",
    overview:
      "Track everyone who visits through your connect forms or QR codes. Each visitor has a status that reflects where they are in your follow-up pipeline: New → Following Up → Connected → Regular.",
    steps: [
      "Use the search bar to find a visitor by name or email.",
      "Filter by status to focus on visitors who need follow-up.",
      "Click a visitor card to expand their details — email, phone, interests.",
      "Use the status buttons to update their follow-up stage. Changes save to the database immediately.",
      "Add notes to track conversations, prayer needs, or next steps. Notes include who wrote them and when.",
    ],
    technical: {
      dataFlow:
        "Visitors are created when someone submits a connect form (`/api/contact` → GoHighLevel CRM + `rcfCheckins`). Status updates and notes hit dedicated PUT/POST endpoints that modify the checkin document in MongoDB.",
      apiRoutes: [
        { method: "GET", path: "/api/admin/visitors", desc: "List all visitors" },
        { method: "PUT", path: "/api/admin/visitors/[id]/status", desc: "Update follow-up status" },
        { method: "POST", path: "/api/admin/visitors/[id]/notes", desc: "Add a note to visitor record" },
      ],
      collections: ["rcfCheckins"],
      notes:
        "Visitor records also sync to GoHighLevel CRM via the /api/contact endpoint. Status values: new, following_up, connected, regular.",
    },
  },

  // ─── Bulletin ───
  {
    section: "bulletin",
    route: "/admin/bulletin",
    title: "Weekly Bulletin",
    icon: "📰",
    overview:
      "Create the weekly bulletin once and it updates everywhere — the printed brochure, the website, and the landing page. Enter this week's sermon info, a main announcement, and toggle which events to feature.",
    steps: [
      "Fill in the sermon title, speaker, and featured verse for this Sunday.",
      "Write the main announcement (appears prominently on all materials).",
      "Toggle events on/off to control which ones appear on this week's materials.",
      "Click 'Save Draft' to save without generating, or 'Generate Brochure PDF' to save and create the printable version.",
      "The schedule preview shows what the weekly schedule section will look like.",
    ],
    technical: {
      dataFlow:
        "Bulletin data saves to `rcfBulletins` collection. Events data is passed as props from server-side `getEvents()`. The Generate PDF action saves the bulletin first, then would trigger PDF generation (future integration).",
      apiRoutes: [
        { method: "GET", path: "/api/admin/bulletins", desc: "List all saved bulletins" },
        { method: "POST", path: "/api/admin/bulletins", desc: "Create/save a new bulletin" },
        { method: "PUT", path: "/api/admin/bulletins/[id]", desc: "Update an existing bulletin" },
        { method: "DELETE", path: "/api/admin/bulletins/[id]", desc: "Delete a bulletin" },
      ],
      collections: ["rcfBulletins", "rcfEvents"],
    },
  },

  // ─── Agape ───
  {
    section: "agape",
    route: "/admin/agape",
    title: "Agape Meals",
    icon: "🍽️",
    overview:
      "Track Wednesday night Agape Meals — log families as they arrive, monitor your annual meals-served goal, and see monthly donation breakdowns. The meals counter updates in real-time as you check families in.",
    steps: [
      "As families arrive, type their name and the number of people, then click 'Check In'.",
      "The meals counter at the top updates immediately with each check-in.",
      "Recent check-ins show below the form so you can verify entries.",
      "The monthly breakdown shows meals served and donations by month.",
      "The volunteers section shows who's signed up and their roles.",
    ],
    technical: {
      dataFlow:
        "Check-ins save to `rcfAgapeCheckins` and simultaneously increment `mealsServed` in the `dashboardStats` settings document. The meals counter uses the stat from props on load, then updates locally with each check-in.",
      apiRoutes: [
        { method: "GET", path: "/api/admin/agape/checkins", desc: "List recent check-ins" },
        { method: "POST", path: "/api/admin/agape/checkins", desc: "Log a family check-in" },
      ],
      collections: ["rcfAgapeCheckins", "rcfSettings"],
      notes:
        "Each POST to checkins also runs `$inc` on `rcfSettings.dashboardStats.mealsServed` so the dashboard stat stays in sync.",
    },
  },

  // ─── AI Tools ───
  {
    section: "ai",
    route: "/admin/ai",
    title: "AI Sermon Tools",
    icon: "🤖",
    overview:
      "Process a sermon recording to automatically generate a summary, discussion questions, daily devotionals, a kids version, and social media posts. Upload an audio file or paste a YouTube URL, then let the AI pipeline do the rest.",
    steps: [
      "Upload a sermon audio file (drag and drop or browse) or paste a YouTube URL.",
      "You can also click a recent YouTube upload to auto-fill the URL.",
      "Click 'Process Sermon with AI' to start the pipeline.",
      "Watch the 7-step progress as the AI processes the sermon.",
      "When done, click any output card (Summary, Questions, etc.) to preview it.",
      "Use the auto-distribute toggles to choose where content gets published.",
      "Click 'Publish All' to push the sermon and generated content to the member portal.",
    ],
    technical: {
      dataFlow:
        "Sermons are stored in `rcfSermons`. The publish action sends a PUT to update the sermon's `published` field to `true`. Published sermons appear on the member sermon page. Revalidation triggers on `/member/sermon` after any sermon write.",
      apiRoutes: [
        { method: "GET", path: "/api/admin/sermons", desc: "List all sermons (including unpublished)" },
        { method: "POST", path: "/api/admin/sermons", desc: "Create a new sermon record" },
        { method: "PUT", path: "/api/admin/sermons/[id]", desc: "Update/publish a sermon" },
        { method: "DELETE", path: "/api/admin/sermons/[id]", desc: "Delete a sermon" },
      ],
      collections: ["rcfSermons"],
      notes:
        "The AI processing pipeline is currently simulated with timed steps. When integrated with a real AI service, the pipeline steps will make actual API calls for transcription, NLP, and content generation.",
    },
  },

  // ─── Social ───
  {
    section: "social",
    route: "/admin/social",
    title: "Social Media",
    icon: "📱",
    overview:
      "Monitor Facebook engagement and plan your weekly content. See check-in trends, use the Sunday check-in script to encourage congregation participation, and follow the content calendar for consistent posting.",
    steps: [
      "Check the stats cards for today's Facebook check-ins and total page likes.",
      "Read the Sunday check-in script aloud during the service to encourage check-ins.",
      "Review the weekly check-in trend chart to see if engagement is growing.",
      "Follow the content calendar ideas for what to post each day of the week.",
      "Read the growth strategy tips and implement one per week.",
    ],
    technical: {
      dataFlow:
        "Social stats come from `dashboardStats` in `rcfSettings`. The check-in trend chart and content calendar are currently using sample data. Future integration will pull from Facebook Graph API.",
      apiRoutes: [
        { method: "GET", path: "/api/admin/stats", desc: "Fetch social engagement stats" },
      ],
      collections: ["rcfSettings"],
      notes:
        "Facebook integration is planned for a future phase. Currently, stats are manually updated or seeded.",
    },
  },

  // ─── System Architecture (super-admin only reference) ───
  {
    section: "architecture",
    route: "/admin/help",
    title: "System Architecture",
    icon: "🏗️",
    overview: "Technical overview of how the platform is built.",
    steps: [],
    technical: {
      dataFlow:
        "Next.js 14 App Router with Server Components for data fetching and Client Components for interactivity. All data flows through `lib/data.ts` which queries MongoDB directly with fallback to hardcoded constants. Admin writes go through authenticated API routes under `/api/admin/*`.",
      apiRoutes: [],
      collections: [
        "rcfStaff",
        "rcfMembers",
        "rcfSermons",
        "rcfEvents",
        "rcfBulletins",
        "rcfPrayerRequests",
        "rcfGiving",
        "rcfAgapeCheckins",
        "rcfCheckins",
        "rcfSettings",
        "rcfSchedule",
        "rcfGivingFunds",
        "rcfGivingMethods",
      ],
      notes:
        "Architecture pattern: page.tsx (async Server Component) → calls data functions → passes props to *Client.tsx (use client). Auth uses magic link flow: email → token → JWT pair (access + refresh). Staff tokens stored as rcf_staff_* in localStorage. All admin API routes verify the JWT via requireStaffAuth() before processing.",
    },
  },

  // ─── Auth Flow (super-admin only reference) ───
  {
    section: "auth",
    route: "/admin/help",
    title: "Authentication & Login",
    icon: "🔐",
    overview:
      "The platform uses magic link authentication — no passwords. Staff and members enter their email, receive a one-time login link, and click it to sign in.",
    steps: [
      "Go to /login and enter your email address.",
      "Choose 'Staff Login' (you'll be directed to the admin dashboard) or 'Member Login'.",
      "In dev mode, a yellow button appears with the login link. In production, the link is emailed.",
      "Click the link to verify and sign in. You'll be redirected automatically.",
      "Sessions last 1 hour. Your token refreshes automatically — you shouldn't need to re-login.",
    ],
    technical: {
      dataFlow:
        "Login flow: POST /api/auth/staff/request-link (generates 64-char token, stores in rcfStaff with 1hr expiry) → user clicks verify link → POST /api/auth/staff/verify (exchanges token for JWT pair) → tokens stored in localStorage → auto-refresh via getStaffAccessToken() when within 5min of expiry.",
      apiRoutes: [
        { method: "POST", path: "/api/auth/staff/request-link", desc: "Generate magic link token" },
        { method: "POST", path: "/api/auth/staff/verify", desc: "Exchange token for JWT pair" },
        { method: "POST", path: "/api/auth/staff/refresh", desc: "Refresh access token" },
      ],
      collections: ["rcfStaff", "rcfMembers"],
      notes:
        "JWT payload includes: userId, email, type (rcf_admin/rcf_member), role (superadmin/admin). Access tokens expire in 1 hour, refresh tokens in 365 days. The verify page is excluded from the admin auth guard so it works pre-authentication.",
    },
  },

  // ─── Ambassador Program ───
  {
    section: "ambassador",
    route: "/admin/ambassadors",
    title: "Ambassador Program",
    icon: "🤝",
    overview:
      "The Ambassador Program lets church members earn points by inviting others. Each ambassador gets a unique referral link (/ref/their-slug). When someone clicks that link and then visits, signs up for a small group, attends an event, or takes another tracked action, the ambassador earns points they can redeem for rewards.",
    steps: [
      "Share the signup link (/ambassador) with potential ambassadors — it's self-service.",
      "Ambassadors log in via magic link (no password) at /ambassador/login.",
      "Track who's performing well on the Overview tab — see total clicks, conversions, and points.",
      "Manage ambassador status: activate, suspend, or delete from the Ambassadors tab.",
      "Fulfill pending reward redemptions on the Redemptions tab.",
      "Record conversions manually: when a visitor referred by an ambassador takes action, use the record-conversion API.",
    ],
    technical: {
      dataFlow:
        "Referral flow: Visitor clicks /ref/[slug] → client stores rcf_ref cookie (90 days) → POST /api/ambassador/track-click records click and increments ambassador.totalClicks → visitor completes form → POST /api/ambassador/record-conversion attributes points based on trackableProducts config → ambassador.totalPoints and totalReferrals updated via $inc. Ambassador auth: POST /api/ambassador/auth/magic-link → token stored in rcfAmbassadorAuthTokens (15min TTL) → POST /api/ambassador/auth/verify → session token stored in rcfAmbassadorSessions (30 day TTL).",
      apiRoutes: [
        { method: "GET", path: "/api/ambassador/config", desc: "Get ambassador program config" },
        { method: "POST", path: "/api/ambassador/signup", desc: "Register new ambassador (fraud-checked)" },
        { method: "POST", path: "/api/ambassador/auth/magic-link", desc: "Request ambassador login link" },
        { method: "POST", path: "/api/ambassador/auth/verify", desc: "Verify magic link token, create session" },
        { method: "GET", path: "/api/ambassador/auth/session", desc: "Validate session token" },
        { method: "POST", path: "/api/ambassador/track-click", desc: "Track referral link click" },
        { method: "POST", path: "/api/ambassador/record-conversion", desc: "Record conversion and award points" },
        { method: "GET", path: "/api/ambassador/stats", desc: "Ambassador dashboard stats" },
        { method: "GET", path: "/api/ambassador/leaderboard/:locationId", desc: "Leaderboard (aggregation)" },
        { method: "POST", path: "/api/ambassador/redeem", desc: "Redeem reward (deducts points)" },
        { method: "GET", path: "/api/ambassador/admin/ambassadors", desc: "List all ambassadors (staff)" },
        { method: "PUT", path: "/api/ambassador/admin/ambassadors/:id/status", desc: "Update ambassador status (staff)" },
        { method: "DELETE", path: "/api/ambassador/admin/ambassadors/:id", desc: "Delete ambassador + data (staff)" },
        { method: "GET", path: "/api/ambassador/admin/dashboard", desc: "Admin dashboard aggregation (staff)" },
        { method: "GET", path: "/api/ambassador/admin/redemptions", desc: "List redemptions (staff)" },
        { method: "PUT", path: "/api/ambassador/admin/redemptions/:id/fulfill", desc: "Fulfill reward redemption (staff)" },
      ],
      collections: [
        "rcfAmbassadorConfig",
        "rcfAmbassadors",
        "rcfAmbassadorClicks",
        "rcfAmbassadorConversions",
        "rcfAmbassadorSessions",
        "rcfAmbassadorAuthTokens",
        "rcfAmbassadorRedemptions",
      ],
      notes:
        "Fraud detection runs on signup: disposable email check, spam TLD, gibberish name detection (Shannon entropy + consonant clusters), domain velocity (5+ signups/hour = block), global velocity (10+ signups/10min = block). Risk score > 40 blocks signup. Ambassador portal is fully separate from member/staff auth — uses session tokens stored in rcfAmbassadorSessions, not JWTs. Rewards are fulfilled manually by staff (no auto-coupon generation for church context).",
    },
  },
];

/**
 * Get help content for a specific admin page section.
 */
export function getHelpForSection(section: string): HelpEntry | undefined {
  return helpContent.find((h) => h.section === section);
}

/**
 * Get all help entries relevant to the help reference page.
 */
export function getAllHelp(): HelpEntry[] {
  return helpContent;
}
