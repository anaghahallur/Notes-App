// 🔗 Backend base URL (Render)
const API_URL = "https://notes-app-1-gw0y.onrender.com"; 

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

// 🔁 Toggle between signup and login
document.getElementById("goToLogin").addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  message.textContent = "";
});

document.getElementById("goToSignup").addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  message.textContent = "";
});

// 📝 Signup
document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !password) {
    message.textContent = "⚠️ Please fill all fields.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      message.textContent = "✅ Signup successful! Please login.";
      signupForm.reset();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
    } else {
      message.textContent = data.error || "❌ Signup failed!";
    }
  } catch (err) {
    message.textContent = "⚠️ Something went wrong. Please try again later.";
    console.error(err);
  }
});

// 🔐 Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    message.textContent = "⚠️ Please enter both email and password.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      message.textContent = "✅ Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      message.textContent = data.error || "❌ Invalid credentials.";
    }
  } catch (err) {
    message.textContent = "⚠️ Unable to connect to server.";
    console.error(err);
  }
});