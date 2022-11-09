import mongoose from "mongoose";
import { MONGO_URI, MONGO_PASS, MONGO_USER } from "./constants";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false,
        connectTimeoutMS: 10000,
        authSource: "admin",
        user: MONGO_USER,
        pass: MONGO_PASS,
      })
      .then(() => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
