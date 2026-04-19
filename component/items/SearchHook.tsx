import { supabase } from "@/lib/supabase";
import { useState, useCallback } from "react";

type SearchResults = {
  profiles: any[];
  posts: any[];
};

export const useSearch = () => {
  const [results, setResults] = useState<SearchResults>({
    profiles: [],
    posts: [],
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // 1. تعريف دالة البحث الأساسية
  const search = useCallback(async (q: string) => {
    setQuery(q);

    if (!q.trim()) {
      setResults({ profiles: [], posts: [] });
      return;
    }

    setLoading(true);

    const [usersRes, postsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, avatar_url, bio")
        .ilike("username", `%${q}%`)
        .limit(5),

      supabase
        .from("posts")
        .select("id, content, image_url, likes_count, comments_count")
        .ilike("content", `%${q}%`)
        .limit(10),
    ]);

    setResults({
      profiles: usersRes.data || [],
      posts: postsRes.data || [],
    });

    setLoading(false);
  }, []);

  // 2. دالة موحدة لحفظ البحث وتنفيذه
  const executeSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;

      // حفظ في LocalStorage
      const history = JSON.parse(
        localStorage.getItem("search_history") || "[]",
      );
      const newHistory = [
        term,
        ...history.filter((h: string) => h !== term),
      ].slice(0, 5);
      localStorage.setItem("search_history", JSON.stringify(newHistory));

      // تنفيذ البحث
      search(term);
    },
    [search],
  );

  return { query, results, loading, search, executeSearch };
};
