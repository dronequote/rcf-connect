/**
 * Data-fetching layer for RCF Connect.
 *
 * Phase 2.5: Functions query MongoDB directly via lib/mongodb.ts.
 * Fallback: If MONGODB_URI is not set, returns hardcoded data from constants.ts.
 * Future: When NestJS RCF module is deployed, switch to fetch() calls.
 *
 * Every page component imports from THIS file — never from constants.ts directly.
 */

import { getDb } from "./mongodb";

import {
  CHURCH,
  EVENTS,
  INTEREST_TAGS,
  GIVE_FUNDS,
  GIVE_METHODS,
  MOCK_MEMBER,
  MOCK_SERMONS,
  MOCK_GIVING_HISTORY,
  MOCK_VISITORS,
  MOCK_STATS,
  USERS,
} from "./constants";

import type {
  ChurchInfo,
  EventsData,
  InterestTagsData,
  GiveFund,
  GiveMethod,
  Member,
  Sermon,
  GivingRecord,
  Visitor,
  DashboardStats,
  AppUser,
} from "./types";

// ─── Church Info ───

export async function getChurch(): Promise<ChurchInfo> {
  try {
    const db = await getDb();
    if (!db) return CHURCH as unknown as ChurchInfo;

    const settings = await db.collection("rcfSettings").find({}).toArray();
    if (!settings.length) return CHURCH as unknown as ChurchInfo;

    const result: Record<string, any> = {};
    for (const doc of settings) {
      if (doc.key !== "dashboardStats" && doc.key !== "interestTags") {
        result[doc.key] = doc.value;
      }
    }
    return result as unknown as ChurchInfo;
  } catch {
    return CHURCH as unknown as ChurchInfo;
  }
}

// ─── Events ───

export async function getEvents(): Promise<EventsData> {
  try {
    const db = await getDb();
    if (!db) return EVENTS as unknown as EventsData;

    const events = await db
      .collection("rcfEvents")
      .findOne({ _id: "events" as any });
    if (!events) return EVENTS as unknown as EventsData;
    return {
      summer: events.summer,
      upcoming: events.upcoming,
      weekly: events.weekly,
    } as EventsData;
  } catch {
    return EVENTS as unknown as EventsData;
  }
}

// ─── Interest Tags ───

export async function getInterestTags(): Promise<InterestTagsData> {
  try {
    const db = await getDb();
    if (!db) return INTEREST_TAGS as unknown as InterestTagsData;

    const doc = await db
      .collection("rcfSettings")
      .findOne({ key: "interestTags" });
    if (!doc) return INTEREST_TAGS as unknown as InterestTagsData;
    return doc.value as InterestTagsData;
  } catch {
    return INTEREST_TAGS as unknown as InterestTagsData;
  }
}

// ─── Giving ───

export async function getGiveFunds(): Promise<GiveFund[]> {
  try {
    const db = await getDb();
    if (!db) return GIVE_FUNDS as unknown as GiveFund[];

    const funds = await db
      .collection("rcfGivingFunds")
      .find({ active: true })
      .toArray();
    if (!funds.length) return GIVE_FUNDS as unknown as GiveFund[];
    return funds as unknown as GiveFund[];
  } catch {
    return GIVE_FUNDS as unknown as GiveFund[];
  }
}

export async function getGiveMethods(): Promise<GiveMethod[]> {
  try {
    const db = await getDb();
    if (!db) return GIVE_METHODS as unknown as GiveMethod[];

    const methods = await db
      .collection("rcfGivingMethods")
      .find({ active: true })
      .toArray();
    if (!methods.length) return GIVE_METHODS as unknown as GiveMethod[];
    return methods as unknown as GiveMethod[];
  } catch {
    return GIVE_METHODS as unknown as GiveMethod[];
  }
}

export async function getGivingHistory(): Promise<GivingRecord[]> {
  try {
    const db = await getDb();
    if (!db) return MOCK_GIVING_HISTORY as unknown as GivingRecord[];

    const records = await db
      .collection("rcfGiving")
      .find({})
      .sort({ date: -1 })
      .toArray();
    if (!records.length)
      return MOCK_GIVING_HISTORY as unknown as GivingRecord[];
    return records as unknown as GivingRecord[];
  } catch {
    return MOCK_GIVING_HISTORY as unknown as GivingRecord[];
  }
}

// ─── Member ───

export async function getMember(): Promise<Member> {
  try {
    const db = await getDb();
    if (!db) return MOCK_MEMBER as unknown as Member;

    const member = await db.collection("rcfMembers").findOne({ id: "m1" });
    if (!member) return MOCK_MEMBER as unknown as Member;
    return member as unknown as Member;
  } catch {
    return MOCK_MEMBER as unknown as Member;
  }
}

// ─── Sermons ───

export async function getSermons(): Promise<Sermon[]> {
  try {
    const db = await getDb();
    if (!db) return MOCK_SERMONS as unknown as Sermon[];

    const sermons = await db
      .collection("rcfSermons")
      .find({ published: true })
      .sort({ date: -1 })
      .toArray();
    if (!sermons.length) return MOCK_SERMONS as unknown as Sermon[];
    return sermons as unknown as Sermon[];
  } catch {
    return MOCK_SERMONS as unknown as Sermon[];
  }
}

// ─── Visitors ───

export async function getVisitors(): Promise<Visitor[]> {
  try {
    const db = await getDb();
    if (!db) return MOCK_VISITORS as unknown as Visitor[];

    const visitors = await db
      .collection("rcfCheckins")
      .find({})
      .sort({ date: -1 })
      .toArray();
    if (!visitors.length) return MOCK_VISITORS as unknown as Visitor[];
    return visitors as unknown as Visitor[];
  } catch {
    return MOCK_VISITORS as unknown as Visitor[];
  }
}

// ─── Stats ───

export async function getStats(): Promise<DashboardStats> {
  try {
    const db = await getDb();
    if (!db) return MOCK_STATS;

    const doc = await db
      .collection("rcfSettings")
      .findOne({ key: "dashboardStats" });
    if (!doc) return MOCK_STATS;
    return doc.value as DashboardStats;
  } catch {
    return MOCK_STATS;
  }
}

// ─── Users (Auth) ───

export async function getUsers(): Promise<AppUser[]> {
  try {
    const db = await getDb();
    if (!db) return USERS;

    const staff = await db
      .collection("rcfStaff")
      .find({ isActive: true })
      .toArray();
    if (!staff.length) return USERS;
    return staff.map((s) => ({
      id: s._id.toString(),
      name: `${s.firstName} ${s.lastName}`,
      email: s.email,
      role: s.role === "superadmin" ? "super-admin" : s.role,
    })) as AppUser[];
  } catch {
    return USERS;
  }
}
