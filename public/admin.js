async function submitLeaderboard() {
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  let users;
  try {
    users = JSON.parse(document.getElementById("jsonInput").value);
  } catch {
    status.textContent = "❌ Invalid JSON";
    return;
  }

  status.textContent = "⏳ Updating leaderboard...";

  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      password,
      users,
      prizes: {
        1: 500,
        2: 200,
        3: 125
      }
    })
  });

  const data = await res.json();

  if (data.success) {
    status.textContent = "✅ Leaderboard updated successfully";
  } else {
    status.textContent = "❌ Error: " + (data.error || "unknown");
  }
}
