import { supabase } from "./_supabase.js";

const DEFAULT_AVATAR =
  "https://cdn.diceblox.com/avatars/default.webp";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const {
    users,
    password,
    days,
    resetTimer,
    prizes,
    archive
  } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get meta
  const { data: meta } = await supabase
    .from("leaderboard_meta")
    .select("*")
    .single();

  const finalPrizes =
    prizes && Object.keys(prizes).length
      ? prizes
      : meta.prizes || {};

  // ===== ARCHIVE =====
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

  // ===== META UPDATE =====
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

  // ===== USERS =====
  if (Array.isArray(users)) {
    await supabase.from("leaderboard_users").delete().neq("id", 0);

    users.sort((a, b) => b.wagered - a.wagered);

    const rows = users.map((u, i) => ({
      username: u.username,
      wagered: u.wagered,
      rank: i + 1,
      prize: finalPrizes[i + 1] || 0,
      avatar_url: u.avatar_url || DEFAULT_AVATAR
    }));

    await supabase.from("leaderboard_users").insert(rows);
  }

  res.json({ success: true });
}
