import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  const { data } = await supabase
    .from("leaderboard_users")
    .select("*")
    .order("rank", { ascending: true });

  res.json(data);
}
