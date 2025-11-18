/* =======================
       TOKEN FROM LOCALSTORAGE
    ======================== */
const token = localStorage.getItem("token");
const articleId = localStorage.getItem("articleEdit");

if (!token) {
  alert("Missing token. Please login again.");
  window.location.href = "../login.html";
}

/* =======================
       LOAD USER INFO ON TOPBAR
    ======================== */
fetch("http://blogs.csm.linkpc.net/api/v1/auth/profile", {
  headers: { Authorization: "Bearer " + token },
})
  .then((res) => res.json())
  .then((data) => {
    const user = data.data;

    document.getElementById("welcomeMessage").innerText =
      "Welcome, " + user.name;
    document.getElementById("email").innerText = user.email;
    document.getElementById("avatar").src =
      user.avatar || "../assets/img/default-avatar.jpg";
  });

/* =======================
       LOAD CATEGORIES
    ======================== */
function loadCategories() {
  const select = document.getElementById("categoryId");

  fetch("http://blogs.csm.linkpc.net/api/v1/categories?_per_page=100", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((data) => {
      select.innerHTML = '<option value="">Select Category</option>';
      data.data.items.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        select.appendChild(opt);
      });
    });
}



/* =======================
       LOAD ARTICLE DATA
    ======================== */
function loadArticleData() {
  fetch(`http://blogs.csm.linkpc.net/api/v1/articles/${articleId}`, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((data) => {
      const article = data.data;

      document.getElementById("title").value = article.title;
      document.getElementById("content").value = article.content;
      document.getElementById("categoryId").value = article.category.id;
      document.getElementById("thumbnailPreview").src = article.thumbnail;
    });
}


/* Thumbnail Preview */
function previewNewThumbnail() {
  const file = document.getElementById("formFile").files[0];
  if (file) {
    document.getElementById("thumbnailPreview").src = URL.createObjectURL(file);
  }
}



/* =======================
       UPDATE ARTICLE
    ======================== */
function updateArticle() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const categoryId = document.getElementById("categoryId").value;

  if (!title || !content || !categoryId) {
    if (!title) document.getElementById("titleError").style.display = "block";
    if (!content)
      document.getElementById("contentError").style.display = "block";
    if (!categoryId)
      document.getElementById("categoryError").style.display = "block";
    return;
  }

  const bodyData = { title, content, categoryId: Number(categoryId) };

  fetch(`http://blogs.csm.linkpc.net/api/v1/articles/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(bodyData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) return alert("Update failed!");

      const file = document.getElementById("formFile").files[0];

      if (file) {
        const fd = new FormData();
        fd.append("thumbnail", file);

        return fetch(
          `http://blogs.csm.linkpc.net/api/v1/articles/${articleId}/thumbnail`,
          {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            body: fd,
          }
        ).then((r) => {
          if (r.ok) window.location.href = "./all_articles.html";
          else alert("Thumbnail upload failed.");
        });
      } else {
        window.location.href = "./all_articles.html";
      }
    })
    .catch((err) => console.error(err));
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadArticleData();
});
