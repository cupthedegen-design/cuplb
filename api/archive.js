import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  const { data: archives } = await supabase
    .from("leaderboard_archive")
    .select(`
      id,
      created_at,
      leaderboard_archive_users (
        username,
        wagered,
        rank,
        prize
      )
    `)
    .order("created_at", { ascending: false });

  res.json(archives);
}
