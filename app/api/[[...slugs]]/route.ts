import { redis } from "@/app/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";
import z from "zod";

const ROOM_TTL = 600;

type MetaData = {
  roomId: string;
  token: string;
  connected: string[] | null;
};

type Message = {
  sender: string;
  text: string;
  createdAt: number;
};

const rooms = new Elysia({
  prefix: "/room",
})
  .post("/create", async () => {
    const roomId = nanoid();
    await redis.hset(`meta-data:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });
    await redis.expire(`meta-data:${roomId}`, ROOM_TTL);
    return {
      roomId,
    };
  })
  .get(
    "/ttl",
    async ({ query }) => {
      const roomKey = `meta-data:${query.roomId}`;
      const ttl = await redis.ttl(roomKey);
      return {
        ttl,
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  )
  .delete(
    "/",
    async ({ query }) => {
      const roomId = query.roomId;
      await redis.del(`meta-data:${roomId}`, `room:${roomId}:messages`);
      
      return {
        success: true,
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
    }
  );

export const messages = new Elysia({
  prefix: "/messages",
})
  // 1️⃣ derive → extract + validate + auth
  .derive(async ({ cookie, query, set }) => {
    const roomId = query.roomId as string | undefined;
    const token = cookie["x-auth-token"]?.value as string | undefined;

    if (!roomId || !token) {
      set.status = 401;
      throw new Error("Missing roomId or token");
    }

    const connected = await redis.hget<string[]>(
      `meta-data:${roomId}`,
      "connected"
    );

    if (connected && !connected.includes(token)) {
      set.status = 403;
      throw new Error("Invalid token");
    }

    const metaDataRes: MetaData = {
      roomId,
      token,
      connected,
    };

    return {
      metaDataRes,
    };
  })

  // 2️⃣ route handler (PURE business logic)
  .post(
    "/",
    async ({ metaDataRes, body }) => {
      const { text } = body;

      const roomKey = `meta-data:${metaDataRes.roomId}`;
      const roomExists = await redis.exists(roomKey);

      if (!roomExists) {
        throw new Error("Room does not exist");
      }

      const messagesKey = `room:${metaDataRes.roomId}:messages`;

      const message: Message = {
        sender: metaDataRes.token,
        text,
        createdAt: Date.now(),
      };

      await redis.rpush(messagesKey, JSON.stringify(message));
      const roomTTL = await redis.ttl(roomKey);
      if (roomTTL > 0) {
        await redis.expire(messagesKey, roomTTL);
      }
      return {
        success: true,
      };
    },
    {
      query: z.object({
        roomId: z.string(),
      }),
      body: z.object({
        text: z.string().max(1000),
      }),
    }
  )
  .get("/", async ({ metaDataRes }) => {
    const roomKey = `meta-data:${metaDataRes.roomId}`;
    const roomExists = await redis.exists(roomKey);

    if (!roomExists) {
      throw new Error("Room does not exist");
    }

    const messagesKey = `room:${metaDataRes.roomId}:messages`;
    const allMessages: Message[] = await redis.lrange(messagesKey, 0, -1);

    const messagesRes = allMessages.map((message) => {
      return {
        ...message,
        sender: message.sender === metaDataRes.token ? "YOU" : "PEER",
      };
    });
    return {
      messagesRes,
    };
  });

export const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;
