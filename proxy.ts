import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "./app/lib/redis";

export type Room = {
  connected: string[];
  createdAt: number;
};

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (!pathname.startsWith("/chat/")) {
    return NextResponse.next();
  }

  const roomId = pathname.split("/").pop();
  if (!roomId) {
    return NextResponse.next();
  }

  const roomKey = `meta-data:${roomId}`;

  const room = await redis.hgetall<Room>(roomKey);

  if (!room || !Array.isArray(room.connected)) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  if (room.connected.length >= 2) {
    return NextResponse.redirect(new URL("/room-full", req.url));
  }

  const existingToken = req.cookies.get("x-auth-token")?.value;

  if (existingToken && room.connected.includes(existingToken)) {
    return NextResponse.next();
  }

  const token = nanoid();

  const res = NextResponse.next();

  res.cookies.set("x-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  await redis.hset(roomKey, {
    connected: JSON.stringify([...room.connected, token]),
  });

  return res;
}

export const config = {
  matcher: "/chat/:path*",
};
