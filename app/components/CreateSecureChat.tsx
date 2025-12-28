"use client";
import { useMutation } from "@tanstack/react-query";
import { client } from "../lib/eden";
import { useRouter } from "next/navigation";
const CreateSecureChat = () => {
  const router = useRouter();

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();
      return res.data;
    },
    onSuccess: (data) => {
      router.push(`/chat/${data?.roomId}`);
    },
  });
  return (
    <button
      onClick={() => createRoom()}
      className="cursor-pointer px-6 py-3 border border-green-400 hover:bg-green-400 hover:text-black transition font-mono"
    >
      Start Secure Chat
    </button>
  );
};

export default CreateSecureChat;
