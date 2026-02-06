fetch("/api/leaderboard")
  .then(res => res.json())
  .then(users => {
    if (!users || !users.length) return;

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
