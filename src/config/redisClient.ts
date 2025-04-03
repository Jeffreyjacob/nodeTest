import dotenv from 'dotenv';
dotenv.config(); 
import { createClient } from "redis";


const redisClient = createClient ({
    url:process.env.REDIS_URI
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
    console.log("🔴 Connected to Redis");
});

(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("🚨 Redis Connection Failed:", error);
    }
})();

export default redisClient;
