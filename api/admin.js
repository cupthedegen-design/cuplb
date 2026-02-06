import { supabase } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { users, prizes, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Invalid users" });
  }

  // wipe old leaderboard
  await supabase.from("leaderboard_users").delete().neq("id", 0);

  users.sort((a, b) => b.wagered - a.wagered);

  const rows = users.map((u, i) => ({
    username: u.username,
    wagered: u.wagered,
    rank: i + 1,
    prize: prizes?.[i + 1] || 0
  }));

  await supabase.from("leaderboard_users").insert(rows);

  res.json({ success: true });
}
