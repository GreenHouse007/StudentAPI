const apiBase = "/students";

async function listStudents() {
  const res = await fetch(apiBase);
  const data = await res.json();
  const tbody = document.querySelector("#studentsTbl tbody");
  tbody.innerHTML = "";
  data.forEach((s) => {
    const tpl = document.querySelector("#rowTpl");
    const tr = tpl.content.firstElementChild.cloneNode(true);
    tr.dataset.id = s._id;
    tr.querySelector(".first").textContent = s.firstName || "";
    tr.querySelector(".last").textContent = s.lastName || "";
    tr.querySelector(".email").textContent = s.email || "";
    tr.querySelector(".age").textContent = s.age || "";
    tr.querySelector(".college").textContent = s.currentCollege || "";

    tr.querySelector(".delete").addEventListener("click", async () => {
      if (!confirm("Delete this student?")) return;
      const r = await fetch(`${apiBase}/${s._id}`, { method: "DELETE" });
      if (r.ok) listStudents();
      else alert("Delete failed");
    });

    tr.querySelector(".edit").addEventListener("click", async () => {
      const newFirst = prompt("First name", s.firstName) || s.firstName;
      const newLast = prompt("Last name", s.lastName) || s.lastName;
      const newEmail = prompt("email", s.email) || s.email;
      const newAge = prompt("age", s.age) || s.age;
      const newCollege =
        prompt("Current College", s.currentCollege) || s.currentCollege;
      const body = {
        firstName: newFirst,
        lastName: newLast,
        email: newEmail,
        age: newAge,
        currentCollege: newCollege,
      };
      const r = await fetch(`${apiBase}/${s._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) listStudents();
      else alert("Update failed");
    });

    tbody.appendChild(tr);
  });
}

document.getElementById("refreshBtn").addEventListener("click", listStudents);

document.getElementById("createBtn").addEventListener("click", async () => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const currentCollege = document.getElementById("currentCollege").value;
  const body = {
    firstName,
    lastName,
    email,
    age: age ? Number(age) : undefined,
    currentCollege,
  };
  const r = await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (r.ok) {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("age").value = "";
    document.getElementById("currentCollege").value = "";
    //listStudents();
  } else {
    alert("Create failed");
  }
});

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", "Bearer " + token);
  headers.set("Content-Type", "application/json");
  return fetch(url, { ...options, headers });
}

function fmtDate(s) {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

// ---- Users table ----
const usersTblBody = document.querySelector("#usersTbl tbody");
const usersRefreshBtn = document.getElementById("usersRefreshBtn");

async function loadUsers() {
  try {
    const r = await authFetch("/auth/users");
    if (r.status === 401) {
      // not authorized → back to login
      localStorage.removeItem("token");
      location.href = "/login.html";
      return;
    }
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      alert("Failed to load users: " + (err.message || r.statusText));
      return;
    }
    const { users } = await r.json();
    usersTblBody.innerHTML = "";
    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.fullName || ""}</td>
        <td>${u.email || ""}</td>
        <td>${u.userType || ""}</td>
        <td>${fmtDate(u.createdAt)}</td>
      `;
      usersTblBody.appendChild(tr);
    });
  } catch (e) {
    alert("Network error loading users: " + e.message);
  }
}

usersRefreshBtn?.addEventListener("click", loadUsers);

// Auto-load users when the page opens
document.addEventListener("DOMContentLoaded", () => {
  // simple guard:
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    location.href = "/index.html";
    return;
  }
  loadUsers();
});

// ---- Logout ----
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  res.clearCookie("token");
});

// initial load
//listStudents();

// ... all your functions above: listStudents, loadUsers, authFetch, etc.

// REMOVE any plain `listStudents();` here.

// Guard + init
async function guardAndInit() {
  const token = localStorage.getItem("token");
  if (!token) {
    location.href = "/index.html";
    return;
  }

  try {
    const r = await fetch("/auth/protected", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!r.ok) {
      localStorage.removeItem("token");
      location.href = "/index.html";
      return;
    }
  } catch {
    location.href = "/index.html";
    return;
  }

  // Only run your page logic after the token checks out:
  await loadUsers();
  await listStudents();
}

document.addEventListener("DOMContentLoaded", guardAndInit);
