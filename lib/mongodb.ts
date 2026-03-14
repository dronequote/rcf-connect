/**
 * MongoDB connection helper for Next.js Server Components.
 *
 * Phase 2.5: Direct MongoDB queries from data.ts
 * Phase 3+: Once NestJS RCF module is deployed, data.ts switches to
 *           fetch() calls and this file is no longer needed.
 */

import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let db: Db;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  console.warn('⚠️ MONGODB_URI not set — falling back to constants');
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In dev, use a global variable so the connection is preserved across HMR
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;
  const c = await clientPromise;
  return c.db('lpai');
}
