const fakeUsers = [
  { rank: 4, user: "player_four", wagered: 502340, prize: 62.5 },
  { rank: 5, user: "player_five", wagered: 410220, prize: 37.5 },
  { rank: 6, user: "player_six", wagered: 298100, prize: 25 },
  { rank: 7, user: "player_seven", wagered: 201400, prize: 12.5 },
  { rank: 8, user: "player_eight", wagered: 154900, prize: 12.5 }
];

const tbody = document.getElementById("leaderboardBody");

fakeUsers.forEach(u => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>#${u.rank}</td>
    <td>${u.user}</td>
    <td>$${u.wagered.toLocaleString()}</td>
    <td>$${u.prize}</td>
  `;
  tbody.appendChild(tr);
});
