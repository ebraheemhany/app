"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export type Message = {
  id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  participant_one: string;
  participant_two: string;
  last_message: string | null;
  last_message_at: string | null;
  otherUser?: {
    id: string;
    username: string;
    avatar_url: string;
  };
  unreadCount?: number;
};

// ─────────────── Conversations ───────────────
export function useConversations(currentUserId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id, participant_one, participant_two,
        last_message, last_message_at
      `)
      .or(
        `participant_one.eq.${currentUserId},participant_two.eq.${currentUserId}`
      )
      .order("last_message_at", { ascending: false });

    if (error || !data) return;

    const enriched = await Promise.all(
      data
        .map(async (conv) => {
          const otherUserId =
            conv.participant_one === currentUserId
              ? conv.participant_two
              : conv.participant_one;

          // تخطي المحادثات حيث يكون المستخدم الآخر هو نفس المستخدم الحالي
          if (otherUserId === currentUserId) {
            return null;
          }

          // user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .eq("id", otherUserId)
            .single();

          // unread count
          const { count } = await supabase
            .from("messages")
            .select("id", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("is_read", false)
            .neq("sender_id", currentUserId);

          return {
            ...conv,
            otherUser: profile || undefined,
            unreadCount: count || 0,
          };
        })
    ).then((results) => results.filter((r) => r !== null) as Conversation[]);

    setConversations(enriched);
    setLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    fetchConversations();

    const channel = supabase
      .channel(`conversations:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        fetchConversations
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations, currentUserId]);

  return { conversations, loading, refetch: fetchConversations };
}

// ─────────────── Start Conversation ───────────────
export async function startConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  // تحقق من وجود محادثة بين المستخدمين
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant_one.eq.${currentUserId},participant_two.eq.${otherUserId}),and(participant_one.eq.${otherUserId},participant_two.eq.${currentUserId})`
    )
    .single();

  if (existing) {
    return existing.id;
  }

  // إنشاء محادثة جديدة
  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({
      participant_one: currentUserId,
      participant_two: otherUserId,
      last_message: null,
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;
  return newConv.id;
}

// ─────────────── Chat ───────────────
export function useChat(conversationId?: string, currentUserId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const markAsRead = useCallback(async () => {
    if (!conversationId || !currentUserId) return;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", currentUserId)
      .eq("is_read", false);
  }, [conversationId, currentUserId]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(data);
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !conversationId || !currentUserId) return;

      const message = content.trim();

      await Promise.all([
        supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: message,
        }),
        supabase
          .from("conversations")
          .update({
            last_message: message,
            last_message_at: new Date().toISOString(),
          })
          .eq("id", conversationId),
      ]);
    },
    [conversationId, currentUserId]
  );

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    fetchMessages();
    markAsRead();

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new as Message];
          });

          if (payload.new.sender_id !== currentUserId) {
            markAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, fetchMessages, markAsRead]);

  // scroll عند كل رسالة جديدة
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return { messages, loading, sendMessage, bottomRef };
}