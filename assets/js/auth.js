
const API_BASE = "http://blogs.csm.linkpc.net/api/v1";
const DASHBOARD_URL = "/pages/dashboard.html";

/* --------------------------------------------------------------
         2. DOM Elements
         -------------------------------------------------------------- */
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const spinner = document.getElementById("loginSpinner");
const messageDiv = document.getElementById("loginMessage");

/* --------------------------------------------------------------
         3. Show Message (Success / Error)
         -------------------------------------------------------------- */
function showMessage(text, type = "danger") {
  messageDiv.innerHTML = `
          <div class="alert alert-${type} alert-dismissible fade show mt-3">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        `;
}

function clearMessage() {
  messageDiv.innerHTML = "";
}

/* --------------------------------------------------------------
         4. Handle Login Submit
         -------------------------------------------------------------- */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessage();

  // Client-side validation
  if (!loginForm.checkValidity()) {
    loginForm.classList.add("was-validated");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Show loading
  spinner.classList.remove("d-none");

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.result && data.data?.token) {
      // Save token & user info
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "userName",
        data.data.user?.name || email.split("@")[0]
      );

      showMessage("Login successful! Redirecting...", "success");

      // Redirect after 1 sec
      setTimeout(() => {
        window.location.href = DASHBOARD_URL;
      }, 1000);
    } else {
      throw new Error(data.message || "Invalid email or password");
    }
  } catch (err) {
    showMessage(err.message);
  } finally {
    spinner.classList.add("d-none");
  }
});

/* --------------------------------------------------------------
         5. Auto-fill email if saved
         -------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) emailInput.value = savedEmail;
});
