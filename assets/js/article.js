//

//

fetch("http://blogs.csm.linkpc.net/api/v1/articles")
  .then((res) => res.json())
  .then((result) => {
    const data = result.data?.items || [];
    let cardHTML = "";

    data.forEach((item) => {
      let contentText = "";
      try {
        let parsed = JSON.parse(item.content);
        contentText =
          parsed.ops?.map((op) => op.insert).join("") || item.content;
      } catch {
        contentText = item.content;
      }

      contentText =
        contentText.length > 100
          ? contentText.substring(0, 100) + "..."
          : contentText;

      let thumbnail =
        item.thumbnail || "https://via.placeholder.com/400x200?text=No+Image";
      let creatorName = item.creator
        ? `${item.creator.firstName} ${item.creator.lastName}`
        : "Unknown";
      let creatorAvatar =
        item.creator?.avatar || "https://via.placeholder.com/40?text=U";
      let categoryName = item.category?.name || "Uncategorized";

      cardHTML += `
            <div class=" col-md-4 col-lg-3 ">
                <div class="card shadow-sm border-0" onclick = "clicked(${item.id})">
                  <img src="${thumbnail}" class="card-img-top" alt="Thumbnail" style="height:200px;object-fit:cover;">
                  <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text text-muted">${contentText}</p>
                  </div>
                  <div class="card-footer  border-0 d-flex justify-content-between align-items-center">
                    
                    <div class="creator d-flex align-items-center gap-2">
                      <img src="${creatorAvatar}" alt="Avatar" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">
                      <span class="text-muted" style="font-size:1rem;">${creatorName}</span>
                    </div>
                  </div>
                </div>
            </div>
          `;
    });

    document.getElementById("articleContainer").innerHTML =
      cardHTML || `<p class="text-muted text-center">No articles found.</p>`;
  });
function clicked(id) {
  console.log(id);
  localStorage.setItem("article_id", id);
  location.href = "../pages/detail_article.html";
}

// Get request API by Single

let myToken = localStorage.getItem("token");
let article_id = localStorage.getItem("article_id");
const rowDis = document.getElementById("rowDis");

fetch("http://blogs.csm.linkpc.net/api/v1/articles/" + article_id, {
  headers: { Authorization: `Bearer ${myToken}` },
})
  .then((res) => res.json())
  .then((data) => {
    let content = data.data.content;
    let htmlContent = "";

    try {
      const delta = JSON.parse(content);
      if (delta.ops) {
        delta.ops.forEach((op) => {
          let text = op.insert;
          if (op.attributes?.bold) {
            text = `<strong>${text}</strong>`;
          }
          htmlContent += text.replace(/\n/g, "<br>");
        });
      }
    } catch (e) {
      htmlContent = content;
    }
    const creator = data.data.creator;

    rowDis.innerHTML = `
      <div class="col-12">
        <div class="card">
          <img
            src="${data.data.thumbnail}"
            class="card-img-top " 
             style="height:600px; object-fit:cover;"
            "
          />
          <div class="card-body">
            <h5 class="card-title">${data.data.title}</h5>

            <div class="d-flex align-items-center mb-3">
              <img
                src="${creator.avatar}"
                width="60"
                height="60"
                style="border-radius: 50%; object-fit: cover;"
              />
              <div class="ms-3">
                <h6 class="mb-0">${creator.firstName} ${creator.lastName}</h6>
                <small>ID: ${creator.id}</small>
              </div>
            </div>
            <p class="card-text">${htmlContent}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("disArt").innerText = data.data.title;
  });

// Fetch profile info
const username = document.getElementById("welcomeMessage");
const email = document.getElementById("email");
const avatar = document.getElementById("avatar");

fetch("http://blogs.csm.linkpc.net/api/v1/auth/profile", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
  .then((res) => res.json())
  .then((data) => {
    const profile = data.data;
    username.innerText = `Welcome, ${profile.firstName} ${profile.lastName}!`;
    email.innerText = profile.email;
    avatar.src = profile.avatar || "https://via.placeholder.com/50";
  })
  .catch((err) => console.error(err));

/* --------------------------------------------------------------
     PROFILE – Show name & email when avatar is clicked
   -------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggle = document.getElementById("profileDropdown");
  const welcomeEl = document.getElementById("welcomeMessage");
  const emailEl = document.getElementById("email");
  const avatarEl = document.getElementById("avatar");
  const logoutBtn = document.getElementById("logoutBtn");

  // Load from localStorage
  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "example@gmail.com";
  const userAvatar =
    localStorage.getItem("userAvatar") || "https://via.placeholder.com/40";

  welcomeEl.textContent = `Welcome, ${userName}!`;
  emailEl.textContent = userEmail;
  avatarEl.src = userAvatar;

  // Show name & email when dropdown opens
  dropdownToggle.addEventListener("click", () => {
    setTimeout(() => {
      // welcomeEl.classList.remove("d-none");
      emailEl.classList.remove("d-none");
    }, 100); // Wait for dropdown animation
  });

  // Optional: Hide again when dropdown closes
  document
    .querySelector(".dropdown-menu")
    .addEventListener("hidden.bs.dropdown", () => {
      welcomeEl.classList.add("d-none");
      emailEl.classList.add("d-none");
    });

  // Logout
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });
});
