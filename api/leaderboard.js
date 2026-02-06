import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  const { data: users } = await supabase
    .from("leaderboard_users")
    .select("*")
    .order("rank", { ascending: true });

  const { data: meta } = await supabase
    .from("leaderboard_meta")
    .select("*")
    .single();

  res.json({
    users,
    meta
  });
}
