import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw Error("Mongodb connection string is required");
}

declare global {
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | null;
}

const cachedMogoose =
  globalThis.mongooseCache ??
  (globalThis.mongooseCache = {
    conn: null,
    promise: null,
  });

export default async function connectDB() {
  if (cachedMogoose?.conn) return cachedMogoose?.conn;

  if (!cachedMogoose?.promise) {
    const opts = {
      bufferCommands: false,
    };
    cachedMogoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  cachedMogoose.conn = await cachedMogoose.promise;
  globalThis.mongooseCache = cachedMogoose;
  return cachedMogoose.conn;
}
