import { redisConnection } from "../config/redis.js"; // Assuming redis connection is here

export async function checkRedisHealth() {
  try {
    await redisConnection.connect();
    const pong = await redisConnection.ping();
    if (pong === "PONG") {
      console.log("Redis is up and running!");
    } else {
      throw new Error("Unexpected Redis response");
    }
  } catch (error) {
    console.error("Redis health check failed:", error);
  }
}
