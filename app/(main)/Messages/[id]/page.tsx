// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { ArrowLeft } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { useChat, useConversations } from "@/Query/useConversations";
// import LeftSection from "@/component/leftSection/leftSection";
// import RighteSection from "@/component/righteSection/righteSection";
// import { format } from "date-fns";

// export default function ChatPage() {
//   const { id: conversationId } = useParams<{ id: string }>();
//   const router = useRouter();

//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [input, setInput] = useState("");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setCurrentUserId(data.session?.user.id ?? null);
//     });
//   }, []);

//   const { conversations, loading: convLoading } = useConversations(
//     currentUserId ?? undefined,
//   );

//   const activeConv = conversations.find((c) => c.id === conversationId);

//   const {
//     messages,
//     loading: msgLoading,
//     sendMessage,
//     bottomRef,
//   } = useChat(conversationId ?? undefined, currentUserId ?? undefined);

//   const handleSend = async () => {
//     if (!input.trim() || !conversationId) return;
//     await sendMessage(input);
//     setInput("");
//   };

//   const filteredConvs = conversations.filter((conv) =>
//     conv.otherUser?.username.toLowerCase().includes(search.toLowerCase()),
//   );

//   if (!currentUserId) return null;

//   return (
//     <div className="w-full h-dvh flex flex-col bg-black text-white">
//       {/* Container Main */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* LEFT Sidebar */}
//         <div className="hidden md:block w-[20%] border-r border-gray-800">
//           <LeftSection />
//         </div>

//         {/* CENTER Chat Area */}
//         <div className="flex-1 flex flex-col min-w-0 ">
//           {/* HEADER */}

//           <div className=" shrink-0 flex items-center gap-3 p-4 border-b border-gray-800">
//             <button
//               onClick={() => router.push("/messages")}
//               className="md:hidden p-1 rounded-full hover:bg-[#1c1c1f] "
//             >
//               <ArrowLeft size={20} className="cursor-pointer" />
//             </button>
//             <Image
//               src={activeConv?.otherUser?.avatar_url || "/default-avatar.png"}
//               alt="avatar"
//               width={40}
//               height={40}
//               className="rounded-full object-cover"
//             />
//             <h3 className="font-semibold text-lg truncate bg-red-950">
//               {activeConv?.otherUser?.username || "Loading..."}
//             </h3>
//           </div>

//           {/* MESSAGES AREA (Scrollable) */}
//           <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
//             {msgLoading && (
//               <p className="text-gray-500 text-sm text-center">
//                 Loading messages...
//               </p>
//             )}

//             {messages.map((msg) => {
//               const isOwn = msg.sender_id === currentUserId;
//               return (
//                 <div
//                   key={msg.id}
//                   className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
//                 >
//                   <div
//                     className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
//                       isOwn
//                         ? "bg-blue-600 text-white rounded-br-sm"
//                         : "bg-[#1a1a1b] text-white rounded-bl-sm"
//                     }`}
//                   >
//                     {msg.content}
//                   </div>
//                   <div className="flex items-center gap-1 mt-1">
//                     <span className="text-[10px] text-gray-500">
//                       {format(new Date(msg.created_at), "hh:mm a")}
//                     </span>
//                     {isOwn && (
//                       <span className="text-[10px] text-gray-400">
//                         {msg.is_read ? "✓✓" : "✓"}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={bottomRef} />
//           </div>

//           {/* INPUT AREA (Fixed at bottom) */}
//           <div className="shrink-0 p-4 border-t border-gray-800 bg-[#0f0f10]">
//             <div className="flex gap-2">
//               <input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 placeholder="Type a message..."
//                 className="flex-1 bg-[#1a1a1b] p-3 rounded-lg outline-none text-sm text-white placeholder:text-gray-500"
//               />
//               <button
//                 onClick={handleSend}
//                 disabled={!input.trim()}
//                 className="bg-blue-600 px-5 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT Sidebar */}
//         <div className="w-[16%] hidden lg:block border-l border-gray-800">
//           <RighteSection />
//         </div>
//       </div>
//     </div>
//   );
// }
