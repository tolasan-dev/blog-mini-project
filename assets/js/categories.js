

function loadCategories() {
  fetch("http://blogs.csm.linkpc.net/api/v1/categories", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("Categories:", data);

      // FIX: categories are inside data.data.items
      renderCategories(data.data.items);
    })
    .catch((err) => {
      console.error("Fetch error:", err.message);
      const errorBox = document.getElementById("categoryError");
      errorBox.classList.remove("d-none");
      errorBox.textContent = "Failed to load categories: " + err.message;
    });
}

// ===== FUNCTION: Render categories into table =====
function renderCategories(categories) {
  const tbody = document.querySelector("#categoryTable tbody");
  tbody.innerHTML = ""; // clear table

  categories.forEach((cat) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${cat.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-warning">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        </td>
      `;

    tbody.appendChild(tr);
  });
}

// ===== CALL FUNCTION WHEN PAGE LOADS =====
loadCategories();
