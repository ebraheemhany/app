// hooks/useSearch.ts
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

  return { query, results, loading, search };
};
