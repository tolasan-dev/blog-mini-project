document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }

  // Load profile
  fetch("http://blogs.csm.linkpc.net/api/v1/auth/profile", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((data) => {
      const profile = data.data;
      document.getElementById(
        "welcomeMessage"
      ).innerText = `Welcome, ${profile.firstName} ${profile.lastName}!`;
      document.getElementById("email").innerText = profile.email;
      document.getElementById("avatar").src =
        profile.avatar || "https://via.placeholder.com/150";
    })
    .catch(console.error);

  // Load categories
  const categorySelect = document.getElementById("categoryId");
  categorySelect.innerHTML =
    "<option selected disabled>Loading categories...</option>";
  fetch("http://blogs.csm.linkpc.net/api/v1/categories?_per_page=100", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((data) => {
      categorySelect.innerHTML = '<option value="">Select Category</option>';
      if (data.data.items && data.data.items.length > 0) {
        data.data.items.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.name;
          categorySelect.appendChild(option);
        });
      } else {
        const option = document.createElement("option");
        option.textContent = "No categories found";
        option.disabled = true;
        categorySelect.appendChild(option);
      }
    })
    .catch((err) => {
      console.error(err);
      categorySelect.innerHTML =
        "<option disabled selected>Failed to load categories</option>";
    });
});

function showSuccessToast(message) {
  const toast = document.getElementById("successToast");
  const text = document.getElementById("successMessage");
  text.textContent = message;

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function createArticle() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const categoryId = document.getElementById("categoryId").value;
  const thumbnail = document.getElementById("formFile").files[0];

  // Reset error messages
  ["titleError", "contentError", "categoryError", "fileError"].forEach(
    (id) => (document.getElementById(id).style.display = "none")
  );

  let valid = true;
  if (!title) {
    document.getElementById("titleError").style.display = "block";
    valid = false;
  }
  if (!content || content.length < 10) {
    const cErr = document.getElementById("contentError");
    cErr.textContent = "Content must be at least 10 characters.";
    cErr.style.display = "block";
    valid = false;
  }
  if (!categoryId) {
    document.getElementById("categoryError").style.display = "block";
    valid = false;
  }
  if (!thumbnail) {
    document.getElementById("fileError").style.display = "block";
    valid = false;
  }
  if (!valid) return;

  // Create article
  fetch("http://blogs.csm.linkpc.net/api/v1/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      title,
      content,
      categoryId: Number(categoryId),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.data && data.data.id) {
        const formData = new FormData();
        formData.append("thumbnail", thumbnail);
        return fetch(
          `http://blogs.csm.linkpc.net/api/v1/articles/${data.data.id}/thumbnail`,
          {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            body: formData,
          }
        );
      } else throw new Error("Failed to create article");
    })
    .then((resThumb) => {
      if (resThumb.ok) window.location.href = "../test-own.html";
      else alert("Thumbnail upload failed.");
    })
    .catch((err) => alert(err.message));
}
