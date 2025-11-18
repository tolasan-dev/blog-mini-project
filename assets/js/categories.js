<<<<<<< HEAD


function loadCategories() {
  fetch("http://blogs.csm.linkpc.net/api/v1/categories", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
=======
/* --------------------------------------------------------------
   1. CONFIG
   -------------------------------------------------------------- */
const API_BASE = "http://blogs.csm.linkpc.net/api/v1/categories";
const token = localStorage.getItem("token");

/* --------------------------------------------------------------
   2. DOM Elements
   -------------------------------------------------------------- */
const tbody = document.querySelector("#categoryTable tbody");
const errorBox = document.getElementById("categoryError");
const createModal = document.getElementById("createCategoryModal");
const editModal = document.getElementById("editCategoryModal"); // Add this modal in HTML
const saveCreateBtn = document.getElementById("saveCategoryBtn");
const saveEditBtn = document.getElementById("saveEditBtn");
const createNameInput = document.getElementById("categoryName");
const editNameInput = document.getElementById("editCategoryName");
const editIdInput = document.getElementById("editCategoryId"); // hidden
const deleteModal = document.getElementById("deleteCategoryModal");
const deleteConfirmBtn = document.getElementById("confirmDeleteBtn");
const deleteIdInput = document.getElementById("deleteCategoryId");

/* --------------------------------------------------------------
   3. Show Error / Success
   -------------------------------------------------------------- */
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("d-none");
}
function showSuccess(msg) {
  const box = document.createElement("div");
  box.className = "alert alert-success mt-3";
  box.textContent = msg;
  document
    .querySelector(".card-body")
    .insertBefore(box, document.querySelector(".table-responsive"));
  setTimeout(() => box.remove(), 3000);
}

/* --------------------------------------------------------------
   4. READ – Load All Categories
   -------------------------------------------------------------- */
function loadCategories() {
  if (!token) return showError("Please login first");

  fetch(API_BASE, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
>>>>>>> ad2b70fbacf6ee44c30b08f70cb463f401a2fc3f
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
<<<<<<< HEAD
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

=======
      if (data.result && Array.isArray(data.data.items)) {
        renderCategories(data.data.items);
      } else {
        tbody.innerHTML = "<tr><td colspan='2'>No categories found</td></tr>";
      }
    })
    .catch((err) => {
      showError("Load failed: " + err.message);
    });
}

/* --------------------------------------------------------------
   5. Render Table
   -------------------------------------------------------------- */
function renderCategories(categories) {
  tbody.innerHTML = ""; // clear
  categories.forEach((cat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(cat.name)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-warning me-1" onclick="openEditModal('${
          cat._id
        }', '${escapeHtml(cat.name)}')">
          <i class="bi bi-pencil-square"></i>
          
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${
          cat._id
        }')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
>>>>>>> ad2b70fbacf6ee44c30b08f70cb463f401a2fc3f
    tbody.appendChild(tr);
  });
}

<<<<<<< HEAD
// ===== CALL FUNCTION WHEN PAGE LOADS =====
loadCategories();
=======
/* --------------------------------------------------------------
   6. CREATE – Save New Category
   -------------------------------------------------------------- */
saveCreateBtn.addEventListener("click", () => {
  const name = createNameInput.value.trim();
  if (!name) {
    createNameInput.classList.add("is-invalid");
    return;
  }

  fetch(API_BASE, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    })
    .then((data) => {
      if (data.result) {
        bootstrap.Modal.getInstance(createModal).hide();
        createNameInput.value = "";
        createNameInput.classList.remove("is-invalid");
        loadCategories();
        showSuccess("Category created!");
      }
    })
    .catch((err) => showError(err.message));
});

/* --------------------------------------------------------------
   7. UPDATE – Open Edit Modal
   -------------------------------------------------------------- */
function openEditModal(id, name) {
  editIdInput.value = id;
  editNameInput.value = name;
  new bootstrap.Modal(editModal).show();
}

saveEditBtn.addEventListener("click", () => {
  const id = editIdInput.value;
  const name = editNameInput.value.trim();

  if (!name) {
    editNameInput.classList.add("is-invalid");
    return;
  }

  fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then((data) => {
      if (data.result) {
        bootstrap.Modal.getInstance(editModal).hide();
        loadCategories();
        showSuccess("Category updated!");
      }
    })
    .catch((err) => showError(err.message));
});

/* --------------------------------------------------------------
   8. DELETE – Remove Category
   -------------------------------------------------------------- */

// Store category ID when "Delete" button is clicked
function deleteCategory(id) {
  deleteIdInput.value = id;  // Save ID in hidden input
  new bootstrap.Modal(deleteModal).show();  // Open modal
}

// Confirm delete when user clicks "Delete" in modal
deleteConfirmBtn.addEventListener("click", () => {
  const id = deleteIdInput.value;
  const token = localStorage.getItem("token");

  if (!token) {
    showError("Please login first");
    return;
  }

  fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(data => {
      if (data.result) {
        bootstrap.Modal.getInstance(deleteModal).hide();  // Close modal
        loadCategories();  // Refresh table
        showSuccess("Category deleted!");
      }
    })
    .catch(err => {
      showError(err.message);
    });
});
/* --------------------------------------------------------------
   9. Escape HTML (XSS Safe)
   -------------------------------------------------------------- */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* --------------------------------------------------------------
   10. Auto Load on Page Open
   -------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", loadCategories);
>>>>>>> ad2b70fbacf6ee44c30b08f70cb463f401a2fc3f
