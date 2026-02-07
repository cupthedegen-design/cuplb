import { supabase } from "./_supabase.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export default async function handler(req, res) {
  // ===== LOGIN =====
  if (req.method === "POST" && req.query.login === "true") {
    const { password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { role: "admin" },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({ token });
  }

  // ===== AUTH CHECK =====
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  // ===== ADMIN ACTIONS =====
  const {
    users,
    days,
    resetTimer,
    prizes,
    archive
  } = req.body;

  // get meta
  const { data: meta } = await supabase
    .from("leaderboard_meta")
    .select("*")
    .single();

  const finalPrizes =
    prizes && Object.keys(prizes).length > 0
      ? prizes
      : meta.prizes || {};

  // archive
  if (archive) {
    const { data: archiveRow } = await supabase
      .from("leaderboard_archive")
      .insert({
        start_time: meta.start_time,
        end_time: meta.end_time,
        prizes: finalPrizes
      })
      .select()
      .single();

    const { data: topUsers } = await supabase
      .from("leaderboard_users")
      .select("*")
      .order("rank", { ascending: true })
      .limit(10);

    if (topUsers?.length) {
      await supabase.from("leaderboard_archive_users").insert(
        topUsers.map(u => ({
          archive_id: archiveRow.id,
          username: u.username,
          wagered: u.wagered,
          rank: u.rank,
          prize: u.prize
        }))
      );
    }
  }

  // timer
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

  // users
  if (Array.isArray(users)) {
    await supabase.from("leaderboard_users").delete().neq("id", 0);

    users.sort((a, b) => b.wagered - a.wagered);

    await supabase.from("leaderboard_users").insert(
      users.map((u, i) => ({
        username: u.username,
        wagered: u.wagered,
        rank: i + 1,
        prize: finalPrizes[i + 1] || 0
      }))
    );
  }

  res.json({ success: true });
}
