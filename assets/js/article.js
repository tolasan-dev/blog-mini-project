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
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm border-0" onclick = "clickcard(${item.id})">
                  <img src="${thumbnail}" class="card-img-top" alt="Thumbnail" style="height:180px;object-fit:cover;">
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
function clickcard(id) {
  console.log(id);
  localStorage.setItem("ariticle_id", id);
  location.href = "../detail_article.html";
}

// detail ariticle or Single ariticle

let myToken = localStorage.getItem("token");
let article_id = localStorage.getItem("ariticle_id");
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
            class="card-img-top"
            style="height: 600px;"
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
