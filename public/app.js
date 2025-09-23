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
    listStudents();
  } else {
    alert("Create failed");
  }
});

// initial load
listStudents();
