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

      const totalSeconds = Math.floor(diff / 1000);
      const d = Math.floor(totalSeconds / 86400);
      const h = Math.floor((totalSeconds % 86400) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      const pad = n => String(n).padStart(2, "0");
      timerEl.textContent =
        `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    }

    tick();
    setInterval(tick, 1000);

    // ===== PODIUM (NOW WITH PRIZES) =====
    const [first, second, third] = users;

    // 1st
    document.querySelector(".podium-card.first h3").textContent =
      first.username;
    document.querySelector(".podium-card.first p").textContent =
      `$${Number(first.wagered).toLocaleString()} wagered`;
    document.querySelector(".podium-card.first .prize").textContent =
      `$${first.prize}`;

    // 2nd
    document.querySelector(".podium-card.second h3").textContent =
      second.username;
    document.querySelector(".podium-card.second p").textContent =
      `$${Number(second.wagered).toLocaleString()} wagered`;
    document.querySelector(".podium-card.second .prize").textContent =
      `$${second.prize}`;

    // 3rd
    document.querySelector(".podium-card.third h3").textContent =
      third.username;
    document.querySelector(".podium-card.third p").textContent =
      `$${Number(third.wagered).toLocaleString()} wagered`;
    document.querySelector(".podium-card.third .prize").textContent =
      `$${third.prize}`;

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
