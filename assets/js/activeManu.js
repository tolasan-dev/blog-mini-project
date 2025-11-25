 document.addEventListener("DOMContentLoaded", () => {
        const currentFile = location.pathname
          .split("/")
          .pop()
          .replace(/\.html?$/i, "")
          .toLowerCase(); // navigate mapping base on user staying current page 
          // "all_articles", "category", etc.

        document.querySelectorAll(".sidebar a[data-page]").forEach((link) => {
          const key = link.getAttribute("data-page");

          if (key.toLowerCase() === currentFile) {
            link.classList.add("active");

            // Open accordion for sub-links
            const collapse = link.closest(".accordion-collapse");
            if (collapse) {
              new bootstrap.Collapse(collapse, { toggle: false }).show();
              const btn = collapse
                .closest(".accordion-item")
                .querySelector(".accordion-button");
              if (btn) btn.classList.remove("collapsed");
            }
          } else {
            link.classList.remove("active");
          }
        });
      });