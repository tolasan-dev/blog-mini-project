
/* --------------------------------------------------------------
   1. CONFIG – API URLs (NO /v1!)
   -------------------------------------------------------------- */
const API_LOGIN = "http://blogs.csm.linkpc.net/api/v1/auth/login";
const API_REGISTER = "http://blogs.csm.linkpc.net/api/v1/auth/register";
const DASHBOARD_URL = "/pages/dashboard.html";
const LOGIN_PAGE = "/index.html";

/* --------------------------------------------------------------
   2. HELPERS – Show message & clear
   -------------------------------------------------------------- */
function showMsg(box, text, type = "danger") {
  const color = type === "success" ? "success" : "danger";
  box.innerHTML = `
    <div class="alert alert-${color} alert-dismissible fade show mt-3">
      ${text}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}
function clearMsg(box) {
  box.innerHTML = "";
}

/* --------------------------------------------------------------
   3. LOGIN – Only runs on login page
   -------------------------------------------------------------- */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const emailBox = document.getElementById("email");
  const passBox = document.getElementById("password");
  const spinner = document.getElementById("loginSpinner");
  const msgBox = document.getElementById("loginMessage");

  // Auto-fill email
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("userEmail");
    if (saved) emailBox.value = saved;
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearMsg(msgBox);

    // Check if fields are filled
    if (!emailBox.value.trim() || !passBox.value) {
      showMsg(msgBox, "Please enter email and password", "danger");
      return;
    }

    spinner.classList.remove("d-none");

    fetch(API_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailBox.value.trim(),
        password: passBox.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result && data.data?.token) {
          // Save user info
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userEmail", emailBox.value.trim());
          localStorage.setItem(
            "userName",
            data.data.user?.name || emailBox.value.split("@")[0]
          );

          showMsg(msgBox, "Login success! Going to dashboard...", "success");
          setTimeout(() => {
            window.location.href = DASHBOARD_URL;
          }, 1000);
        } else {
          showMsg(msgBox, data.message || "Wrong email or password", "danger");
        }
      })
      .catch(() => {
        showMsg(msgBox, "No internet. Try again.", "danger");
      })
      .finally(() => {
        spinner.classList.add("d-none");
      });
  });
}

/* --------------------------------------------------------------
   4. REGISTER – Updated for firstName, lastName, confirmPassword
   -------------------------------------------------------------- */
const regForm = document.getElementById("registerForm");
if (regForm) {
  const firstNameBox = document.getElementById("firstName");
  const lastNameBox = document.getElementById("lastName");
  const emailBox = document.getElementById("email");
  const passBox = document.getElementById("password");
  const confirmBox = document.getElementById("confirmPassword");
  const spinner = document.getElementById("registerSpinner");
  const msgBox = document.getElementById("registerMessage");

  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearMsg(msgBox);

    const firstName = firstNameBox.value.trim();
    const lastName = lastNameBox.value.trim();
    const email = emailBox.value.trim();
    const password = passBox.value;
    const confirm = confirmBox.value;

    // Check empty
    if (!firstName || !lastName || !email || !password || !confirm) {
      showMsg(msgBox, "Please fill all fields", "danger");
      return;
    }

    // Check password match
    if (password !== confirm) {
      showMsg(msgBox, "Passwords do not match", "danger");
      return;
    }

    // Check password length
    if (password.length < 6) {
      showMsg(msgBox, "Password too short (min 6)", "danger");
      return;
    }

    spinner.classList.remove("d-none");

    fetch(API_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        confirmPassword: confirm,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          showMsg(msgBox, "Account created! Going to login...", "success");
          setTimeout(() => {
            window.location.href = LOGIN_PAGE;
          }, 1500);
        } else {
          showMsg(msgBox, data.message || "Register failed", "danger");
        }
      })
      .catch(() => {
        showMsg(msgBox, "No internet. Try again.", "danger");
      })
      .finally(() => {
        spinner.classList.add("d-none");
      });
  });
}
