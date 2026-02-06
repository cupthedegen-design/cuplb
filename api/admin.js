import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { users, prizes, password, days, resetTimer } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ===== TIMER LOGIC =====
  if (resetTimer && days) {
    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    await supabase.from("leaderboard_meta").update({
      start_time: start,
      end_time: end,
      last_updated: start
    }).eq("id", true);
  } else {
    // only update last_updated
    await supabase.from("leaderboard_meta").update({
      last_updated: new Date()
    }).eq("id", true);
  }

  // ===== LEADERBOARD DATA =====
  if (Array.isArray(users)) {
    await supabase.from("leaderboard_users").delete().neq("id", 0);

    users.sort((a, b) => b.wagered - a.wagered);

    const rows = users.map((u, i) => ({
      username: u.username,
      wagered: u.wagered,
      rank: i + 1,
      prize: prizes?.[i + 1] || 0
    }));

    await supabase.from("leaderboard_users").insert(rows);
  }

  res.json({ success: true });
}
