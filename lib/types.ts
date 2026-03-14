/* ── Shared types for RCF Connect ── */

// ─── Auth & Users ───

export type UserRole = "super-admin" | "admin" | "member";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// ─── Church Info ───

export interface ChurchInfo {
  name: string;
  shortName: string;
  logo: string;
  address: string;
  phone: string;
  officeHours: string;
  pastor: string;
  musicDirector: string;
  prayerContact: { name: string; phone: string };
  donorPerfect: string;
  venmo: string;
  textToGive: string;
  featuredVerse: string;
  tagline: string;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  googleMaps: string;
}

// ─── Events ───

export interface SummerEvent {
  name: string;
  time: string;
  desc: string;
}

export interface UpcomingEvent {
  name: string;
  time: string;
  desc: string;
  highlight?: boolean;
}

export interface WeeklyEvent {
  day: string;
  name: string;
  time: string;
  desc: string;
}

export interface EventsData {
  summer: readonly SummerEvent[];
  upcoming: readonly UpcomingEvent[];
  weekly: readonly WeeklyEvent[];
}

// ─── Interest Tags ───

export interface InterestTagsData {
  new: readonly string[];
  involved: readonly string[];
  families: readonly string[];
}

// ─── Giving ───

export interface GiveFund {
  id: string;
  label: string;
  desc: string;
}

export interface GiveMethod {
  id: string;
  label: string;
  desc: string;
}

export interface GivingRecord {
  date: string;
  amount: number;
  fund: string;
  method: string;
}

// ─── Member ───

export interface FamilyMember {
  name: string;
  role?: string;
  age?: number;
  grade?: string;
  ministry?: string;
  room?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: "member";
  family: {
    name: string;
    members: FamilyMember[];
  };
  groups: string[];
  notifications: { email: boolean; sms: boolean; prayerDigest: boolean };
}

// ─── Sermons ───

export interface Devotional {
  day: string;
  title: string;
  scripture: string;
  prompt: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  verse: string;
  youtubeUrl: string;
  summary: {
    themes: string[];
    mainMessage: string;
    scriptures: string[];
  };
  questions: string[];
  devotionals: Devotional[];
  kidsVersion: string;
  quote: string;
}

// ─── Visitors ───

export type VisitorStatus = "new" | "following_up" | "connected" | "regular";

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  source: string;
  date: string;
  status: VisitorStatus;
}

// ─── Stats ───

export interface DashboardStats {
  newVisitorsThisWeek: number;
  agapeDonationsThisMonth: number;
  qrScansThisSunday: number;
  activeMembers: number;
  mealsServed: number;
  mealsGoal: number;
  fbCheckinsToday: number;
  fbPageLikes: number;
}
