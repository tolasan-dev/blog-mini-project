

const API_BASE = "http://blogs.csm.linkpc.net/api/v1"; // No /v1? Change if needed
const token = localStorage.getItem("token");

// Redirect to login if no token
if (!token) {
  alert("Please login first!");
  window.location.href = "/index.html";
}

/* --------------------------------------------------------------
   1. LOAD USER PROFILE (Topbar + Dropdown)
   -------------------------------------------------------------- */
function loadUserProfile() {
  const welcomeEl = document.getElementById("welcomeMessage");
  const emailEl = document.getElementById("email");
  const avatarEl = document.getElementById("avatar");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!welcomeEl) return; // skip if not on page with topbar

  fetch(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(res => {
    const user = res.data;
    const fullName = `${user.firstName} ${user.lastName}`;

    // Save to localStorage (for offline)
    localStorage.setItem("userName", fullName);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userAvatar", user.avatar || "https://via.placeholder.com/50");

    // Show in topbar
    welcomeEl.textContent = `Welcome, ${fullName}!`;
    emailEl.textContent = user.email;
    avatarEl.src = user.avatar || "https://via.placeholder.com/50";
  })
  .catch(() => {
    welcomeEl.textContent = "Welcome!";
    emailEl.textContent = "user@example.com";
  });

  // Show email/name on dropdown click
  const dropdown = document.getElementById("profileDropdown");
  if (dropdown) {
    dropdown.addEventListener("click", () => {
      setTimeout(() => {
        welcomeEl.classList.remove("d-none");
        emailEl.classList.remove("d-none");
      }, 100);
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/index.html";
    });
  }
}

/* --------------------------------------------------------------
   2. LOAD ALL ARTICLES (Grid)
   -------------------------------------------------------------- */
function loadAllArticles() {
  const container = document.getElementById("articleContainer");
  if (!container) return; // only run on articles page

  fetch(`${API_BASE}/articles`)
    .then(r => r.json())
    .then(res => {
      const articles = res.data?.items || [];
      let html = "";

      articles.forEach(item => {
        let contentText = "";
        try {
          const parsed = JSON.parse(item.content);
          contentText = parsed.ops?.map(op => op.insert).join("") || item.content;
        } catch {
          contentText = item.content;
        }
        contentText = contentText.length > 100 ? contentText.substring(0, 100) + "..." : contentText;

        const creatorName = item.creator
          ? `${item.creator.firstName} ${item.creator.lastName}`
          : "Unknown";
        const creatorAvatar = item.creator?.avatar || "https://via.placeholder.com/40?text=U";
        const thumbnail = item.thumbnail || "https://via.placeholder.com/400x200?text=No+Image";

        html += `
          <div class="col-md-4 col-lg-3 mb-4">
            <div class="card shadow-sm border-0 h-100" style="cursor:pointer;" onclick="goToArticle('${item.id}')">
              <img src="${thumbnail}" class="card-img-top" style="height:200px; object-fit:cover;">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text text-muted small">${contentText}</p>
              </div>
              <div class="card-footer border-0 bg-white">
                <div class="d-flex align-items-center gap-2">
                  <img src="${creatorAvatar}" class="rounded-circle" width="30" height="30">
                  <span class="text-muted">${creatorName}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html || "<p class='text-center text-muted'>No articles found.</p>";
    });
}

/* --------------------------------------------------------------
   3. GO TO SINGLE ARTICLE
   -------------------------------------------------------------- */
function goToArticle(id) {
  localStorage.setItem("article_id", id);
  window.location.href = "/pages/detail_article.html";
}

/* --------------------------------------------------------------
   4. LOAD SINGLE ARTICLE
   -------------------------------------------------------------- */
function loadSingleArticle() {
  const rowDis = document.getElementById("rowDis");
  const titleEl = document.getElementById("disArt");
  if (!rowDis) return;

  const articleId = localStorage.getItem("article_id");
  if (!articleId) {
    rowDis.innerHTML = "<p class='text-danger'>No article selected.</p>";
    return;
  }

  fetch(`${API_BASE}/articles/${articleId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(res => {
    const item = res.data;
    let htmlContent = "";

    try {
      const delta = JSON.parse(item.content);
      delta.ops.forEach(op => {
        let text = op.insert;
        if (op.attributes?.bold) text = `<strong>${text}</strong>`;
        if (op.attributes?.italic) text = `<em>${text}</em>`;
        htmlContent += text.replace(/\n/g, "<br>");
      });
    } catch {
      htmlContent = item.content;
    }

    const creator = item.creator || {};
    const creatorName = `${creator.firstName || ""} ${creator.lastName || "Unknown"}`.trim();

    rowDis.innerHTML = `
      <div class="col-12">
        <div class="card shadow-lg">
          <img src="${item.thumbnail || 'https://via.placeholder.com/800x400'}" 
               class="card-img-top" style="height:600px; object-fit:cover;">
          <div class="card-body">
            <h1 class="display-5 mb-4">${item.title}</h1>
            
            <div class="d-flex align-items-center mb-4">
              <img src="${creator.avatar || 'https://via.placeholder.com/60'}" 
                   class="rounded-circle me-3" width="60" height="60">
              <div>
                <h5 class="mb-0">${creatorName}</h5>
                <small class="text-muted">${creator.email || ""}</small>
              </div>
            </div>

            <div class="fs-5 lh-lg text-dark">${htmlContent}</div>
            <small class="text-muted d-block mt-4">
              Published: ${new Date(item.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      </div>
    `;

    if (titleEl) titleEl.textContent = item.title;
  })
  .catch(() => {
    rowDis.innerHTML = "<p class='text-danger'>Failed to load article.</p>";
  });
}

/* --------------------------------------------------------------
   5. RUN ON PAGE LOAD
   -------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();      // Always run (topbar)
  loadAllArticles();      // Only on articles page
  loadSingleArticle();    // Only on detail page
});