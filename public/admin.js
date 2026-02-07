const token = localStorage.getItem("adminToken");

if (token) showAdmin();

function showAdmin() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

async function login() {
  const password = document.getElementById("loginPassword").value;
  const status = document.getElementById("loginStatus");

  const res = await fetch("/api/admin?login=true", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("adminToken", data.token);
    showAdmin();
  } else {
    status.textContent = "❌ Invalid password";
  }
}

function logout() {
  localStorage.removeItem("adminToken");
  location.reload();
}

async function submitLeaderboard() {
  const token = localStorage.getItem("adminToken");
  const status = document.getElementById("status");

  let users;
  try {
    users = JSON.parse(document.getElementById("jsonInput").value);
  } catch {
    status.textContent = "Invalid JSON";
    return;
  }

  const prizes = {};
  document.querySelectorAll("#prizes input").forEach(i => {
    if (i.value) prizes[i.dataset.rank] = Number(i.value);
  });

  const res = await fetch("/api/admin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      users,
      prizes,
      days: Number(document.getElementById("days").value),
      resetTimer: document.getElementById("resetTimer").checked
    })
  });

  const data = await res.json();
  status.textContent = data.success ? "Updated!" : "Error";
}

async function archiveLeaderboard() {
  const token = localStorage.getItem("adminToken");

  await fetch("/api/admin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ archive: true })
  });

  alert("Archived!");
}
