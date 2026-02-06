import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const {
    users,
    password,
    days,
    resetTimer,
    prizes
  } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get current meta
  const { data: meta } = await supabase
    .from("leaderboard_meta")
    .select("*")
    .single();

  // Decide which prizes to use
  const finalPrizes =
    prizes && Object.keys(prizes).length > 0
      ? prizes
      : meta.prizes || {};

  // ===== TIMER + META =====
  if (resetTimer && days) {
    const start = new Date();
    const end = new Date(start.getTime() + days * 86400000);

    await supabase.from("leaderboard_meta").update({
      start_time: start,
      end_time: end,
      last_updated: start,
      prizes: finalPrizes
    }).eq("id", true);
  } else {
    await supabase.from("leaderboard_meta").update({
      last_updated: new Date(),
      prizes: finalPrizes
    }).eq("id", true);
  }

  // ===== LEADERBOARD USERS =====
  if (Array.isArray(users)) {
    await supabase.from("leaderboard_users").delete().neq("id", 0);

    users.sort((a, b) => b.wagered - a.wagered);

    const rows = users.map((u, i) => ({
      username: u.username,
      wagered: u.wagered,
      rank: i + 1,
      prize: finalPrizes[i + 1] || 0
    }));

    await supabase.from("leaderboard_users").insert(rows);
  }

  res.json({ success: true });
}
