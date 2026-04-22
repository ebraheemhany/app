"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import { useConversations, useChat } from "@/Query/useConversations";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

function MessagesContent({ searchParams }: { searchParams: any }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeConvId, setActiveConvId] = useState<string | null>(
    searchParams.get("conv") ?? null,
  );
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(
    !!searchParams.get("conv"),
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user.id ?? null);
    });
  }, []);

  const { conversations, loading: convLoading } = useConversations(
    currentUserId ?? undefined,
  );
  const activeConv = conversations.find((c) => c.id === activeConvId);

  const {
    messages,
    loading: msgLoading,
    sendMessage,
    bottomRef,
  } = useChat(activeConvId ?? undefined, currentUserId ?? undefined);

  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return;
    await sendMessage(input);
    setInput("");
  };

  const handleSelectConv = (convId: string) => {
    setActiveConvId(convId);
    setMobileShowChat(true);
  };

  const handleBack = () => {
    setMobileShowChat(false);
    setActiveConvId(null);
  };

  const filteredConvs = conversations.filter((c) =>
    c.otherUser?.username.toLowerCase().includes(search.toLowerCase()),
  );

  if (!currentUserId) return null;

  return (
    <div className="w-full flex justify-center ">
      <div className="w-full md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          <div className="w-full md:w-[70%] lg:w-[60%] mt-0 md:mt-10">
            <div
              className="bg-[#0f0f10] md:mx-0 md:border md:border-gray-800 md:rounded-3xl md:p-5 
            md:shadow-sm mt-20 sm:mt-0  h-[80vh] md:h-[calc(100vh-120px)] flex"
            >
              {/* INBOX */}
              <div
                className={`
                  flex-col p-4
                  w-full md:w-[35%] md:border-r md:border-gray-800
                  ${mobileShowChat ? "hidden md:flex" : "flex"}
                `}
              >
                <h2 className="text-xl font-bold mb-4">Messages</h2>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-[#1a1a1b] p-2 rounded-lg mb-4 outline-none text-sm"
                />

                <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll">
                  {convLoading && (
                    <p className="text-gray-500 text-sm text-center mt-4">
                      Loading...
                    </p>
                  )}

                  {!convLoading && filteredConvs.length === 0 && (
                    <p className="text-gray-500 text-sm text-center mt-4">
                      No conversations yet
                    </p>
                  )}

                  {filteredConvs.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#1c1c1f] transition ${
                        activeConvId === conv.id ? "bg-[#1c1c1f]" : ""
                      }`}
                    >
                      <Image
                        src={
                          conv.otherUser?.avatar_url || "/default-avatar.png"
                        }
                        alt="avatar"
                        width={45}
                        height={45}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {conv.otherUser?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {conv.last_message || "No messages yet"}
                        </p>
                      </div>
                      {(conv.unreadCount ?? 0) > 0 && (
                        <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CHAT */}
              <div
                className={`
                  flex-col flex-1
                  ${mobileShowChat ? "flex" : "hidden md:flex"}
                `}
              >
                {!activeConvId ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-5xl mb-3">💬</span>
                    <p className="text-sm">
                      Select a conversation to start messaging
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-4 border-b border-gray-400 bg-[#1a1a1b]">
                      <button
                        onClick={handleBack}
                        className="md:hidden p-1 rounded-full hover:bg-[#1c1c1f] transition"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <Image
                        src={
                          activeConv?.otherUser?.avatar_url ||
                          "/default-avatar.png"
                        }
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <h3 className="font-semibold">
                        {activeConv?.otherUser?.username || "User"}
                      </h3>
                    </div>

                    <div className="flex-1 min-h-0 p-4 overflow-y-auto flex flex-col gap-2 custom-scroll">
                      {msgLoading && (
                        <p className="text-gray-500 text-sm text-center">
                          Loading...
                        </p>
                      )}
                      {messages.map((msg) => {
                        const isOwn = msg.sender_id === currentUserId;
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-[75%] md:max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                                isOwn
                                  ? "bg-blue-600 text-white rounded-br-sm"
                                  : "bg-[#1a1a1b] text-white rounded-bl-sm"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] text-gray-500">
                                {format(new Date(msg.created_at), "hh:mm a")}
                              </span>
                              {isOwn && (
                                <span className="text-[10px] text-gray-400">
                                  {msg.is_read ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>

                    <div className="p-4 border-t border-gray-800 flex gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-[#1a1a1b] p-2 rounded-lg outline-none text-sm"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-blue-600 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition"
                      >
                        Send
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[20%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchParamsWrapper({
  children,
}: {
  children: (sp: any) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        {(searchParams) => <MessagesContent searchParams={searchParams} />}
      </SearchParamsWrapper>
    </Suspense>
  );
}
