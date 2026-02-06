fetch("/api/leaderboard")
  .then(res => res.json())
  .then(({ users, meta }) => {
    if (!users?.length) return;

    // ===== LAST UPDATED =====
    const updatedAt = new Date(meta.last_updated);
    document.getElementById("updatedAt").textContent =
      updatedAt.toLocaleString();

    // ===== TIMER =====
    const end = new Date(meta.end_time);
    const timerEl = document.getElementById("timer");

    function tick() {
      const diff = end - new Date();
      if (diff <= 0) {
        timerEl.textContent = "Ended";
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const m = Math.floor(diff / (1000 * 60)) % 60;

      timerEl.textContent = `${d}d ${h}h ${m}m`;
    }

    tick();
    setInterval(tick, 60000);

    // ===== PODIUM =====
    const [first, second, third] = users;

    document.querySelector(".podium-card.first h3").textContent = first.username;
    document.querySelector(".podium-card.first p").textContent =
      `$${Number(first.wagered).toLocaleString()} wagered`;

    document.querySelector(".podium-card.second h3").textContent = second.username;
    document.querySelector(".podium-card.second p").textContent =
      `$${Number(second.wagered).toLocaleString()} wagered`;

    document.querySelector(".podium-card.third h3").textContent = third.username;
    document.querySelector(".podium-card.third p").textContent =
      `$${Number(third.wagered).toLocaleString()} wagered`;

    // ===== TABLE =====
    const tbody = document.getElementById("leaderboardBody");
    tbody.innerHTML = "";

    users.slice(3).forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${u.rank}</td>
        <td>${u.username}</td>
        <td>$${Number(u.wagered).toLocaleString()}</td>
        <td>$${u.prize}</td>
      `;
      tbody.appendChild(tr);
    });
  });
