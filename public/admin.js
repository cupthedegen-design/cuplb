async function submitLeaderboard() {
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");
  const days = Number(document.getElementById("days").value);
  const resetTimer = document.getElementById("resetTimer").checked;

  let users;
  try {
    users = JSON.parse(document.getElementById("jsonInput").value);
  } catch {
    status.textContent = "❌ Invalid JSON";
    return;
  }

  // ===== PRIZES =====
  const prizes = {};
  document.querySelectorAll("#prizes input").forEach(input => {
    const rank = input.dataset.rank;
    const value = Number(input.value);
    if (value > 0) prizes[rank] = value;
  });

  status.textContent = "⏳ Updating leaderboard...";

  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      password,
      users,
      prizes,
      days,
      resetTimer
    })
  });

  const data = await res.json();

  status.textContent = data.success
    ? "✅ Leaderboard updated"
    : "❌ Error updating leaderboard";
}

async function archiveLeaderboard() {
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  status.textContent = "📦 Archiving leaderboard...";

  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      password,
      archive: true
    })
  });

  const data = await res.json();
  status.textContent = data.success
    ? "✅ Leaderboard archived"
    : "❌ Failed to archive";
}
