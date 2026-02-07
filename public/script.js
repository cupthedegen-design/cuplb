const DEFAULT_AVATAR =
  "https://cdn.diceblox.com/avatars/default.webp";

fetch("/api/leaderboard")
  .then(res => res.json())
  .then(({ users, meta }) => {
    if (!users || users.length === 0) return;

    /* =====================
       LAST UPDATED
    ====================== */
    if (meta?.last_updated) {
      const updatedAt = new Date(meta.last_updated);
      const updatedEl = document.getElementById("updatedAt");
      if (updatedEl) {
        updatedEl.textContent = updatedAt.toLocaleString();
      }
    }

    /* =====================
       COUNTDOWN TIMER
    ====================== */
    if (meta?.end_time) {
      const end = new Date(meta.end_time);
      const timerEl = document.getElementById("timer");

      if (timerEl) {
        function tick() {
          const diff = end - new Date();

          if (diff <= 0) {
            timerEl.textContent = "Ended";
            return;
          }

          const totalSeconds = Math.floor(diff / 1000);
          const days = Math.floor(totalSeconds / 86400);
          const hours = Math.floor((totalSeconds % 86400) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          const pad = n => String(n).padStart(2, "0");

          timerEl.textContent =
            `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
        }

        tick();
        setInterval(tick, 1000);
      }
    }

    /* =====================
       PODIUM (TOP 3)
    ====================== */
    const podium = {
      first: users[0],
      second: users[1],
      third: users[2]
    };

    if (podium.first) {
      const card = document.querySelector(".podium-card.first");
      card.querySelector("h3").textContent = podium.first.username;
      card.querySelector("p").textContent =
        `$${Number(podium.first.wagered).toLocaleString()} wagered`;
      card.querySelector(".prize").textContent =
        `$${podium.first.prize}`;

      const avatar = card.querySelector(".avatar");
      avatar.style.backgroundImage =
        `url(${podium.first.avatar_url || DEFAULT_AVATAR})`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    }

    if (podium.second) {
      const card = document.querySelector(".podium-card.second");
      card.querySelector("h3").textContent = podium.second.username;
      card.querySelector("p").textContent =
        `$${Number(podium.second.wagered).toLocaleString()} wagered`;
      card.querySelector(".prize").textContent =
        `$${podium.second.prize}`;

      const avatar = card.querySelector(".avatar");
      avatar.style.backgroundImage =
        `url(${podium.second.avatar_url || DEFAULT_AVATAR})`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    }

    if (podium.third) {
      const card = document.querySelector(".podium-card.third");
      card.querySelector("h3").textContent = podium.third.username;
      card.querySelector("p").textContent =
        `$${Number(podium.third.wagered).toLocaleString()} wagered`;
      card.querySelector(".prize").textContent =
        `$${podium.third.prize}`;

      const avatar = card.querySelector(".avatar");
      avatar.style.backgroundImage =
        `url(${podium.third.avatar_url || DEFAULT_AVATAR})`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    }

    /* =====================
       TABLE (RANK 4–10)
    ====================== */
    const tbody = document.getElementById("leaderboardBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    users.slice(3, 10).forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${u.rank}</td>
        <td>${u.username}</td>
        <td>$${Number(u.wagered).toLocaleString()}</td>
        <td>$${u.prize}</td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("Leaderboard load failed:", err);
  });
