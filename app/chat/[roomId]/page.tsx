"use client";

import { client } from "@/app/lib/eden";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function formatTTL(seconds: number) {
  if (seconds <= 0) return "00:00";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ChatPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const roomId = params.roomId as string;

  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // copy clipboard
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const createMessage = useMutation({
    mutationFn: async (text: string) => {
      const res = await client.messages.post({ text }, { query: { roomId } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", roomId] });
    },
  });

  /* -------------------- FETCH MESSAGES -------------------- */
  const allMessages = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } });
      return res.data;
    },
    refetchInterval: 1500,
  });

  /* -------------------- FETCH TTL -------------------- */
  const timeToLive = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } });
      return res.data;
    },
    refetchInterval: 1000,
  });
  /* -------------------- DESTROY -------------------- */
  const destroyRoom = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, { query: { roomId } });
    },
    onSuccess: () => {
      router.replace("/");
    },
  });

  /* -------------------- AUTO REDIRECT ON EXPIRE -------------------- */
  useEffect(() => {
    if (timeToLive.data?.ttl === 0) {
      router.replace("/");
    }
  }, [timeToLive.data?.ttl, router]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-mono">
      {/* ---------------- HEADER ---------------- */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div>
          <p className="text-xs tracking-widest text-slate-400">SECURE ROOM</p>
          <div className="flex flex-row">
            <p className="text-sm text-emerald-400 break-all">{roomId}</p>
            <button
              onClick={copyToClipBoard}
              className="text-sm ml-2 cursor-pointer"
            >
              {copied ? `COPIED` : `COPY`}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-xs text-slate-400">SELF DESTRUCT</p>
            <p
              className={`text-sm font-semibold ${
                (timeToLive.data?.ttl ?? 0) <= 30
                  ? "text-red-400"
                  : "text-cyan-400"
              }`}
            >
              {timeToLive.data?.ttl !== undefined
                ? formatTTL(timeToLive.data.ttl)
                : "--:--"}
            </p>
          </div>

          <button
            onClick={() => destroyRoom.mutate()}
            className="px-4 py-1.5 rounded border border-red-500/60 text-red-400 hover:bg-red-500 hover:text-black transition cursor-pointer"
          >
            DESTROY
          </button>
        </div>
      </header>

      {/* ---------------- MESSAGES ---------------- */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {allMessages.data?.messagesRes?.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-2">
              <p className="text-sm text-slate-400 tracking-widest uppercase">
                Secure Channel
              </p>
              <p className="text-slate-500 text-sm">No messages yet</p>
              <p className="text-xs text-slate-600">Start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {allMessages.data?.messagesRes.map((message) => {
              const isYou = message.sender === "YOU";

              return (
                <div
                  key={message.createdAt}
                  className={`max-w-xl ${isYou ? "ml-auto text-right" : ""}`}
                >
                  <p className="text-xs mb-1 text-slate-400">
                    {isYou ? "YOU" : "PEER"}
                  </p>

                  <div
                    className={`inline-block px-4 py-2 rounded-lg shadow ${
                      isYou
                        ? "bg-emerald-500 text-black"
                        : "bg-cyan-500/10 border border-cyan-500/40 text-cyan-300"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ---------------- INPUT ---------------- */}
      <form
        className="border-t border-slate-800 bg-slate-900/80 px-6 py-4 flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!message.trim()) return;
          createMessage.mutate(message);
          setMessage("");
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="type encrypted message…"
          className="flex-1 bg-slate-950 border border-slate-700 rounded px-4 py-2 text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
        />

        <button
          type="submit"
          className="px-6 py-2 rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition font-semibold"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
