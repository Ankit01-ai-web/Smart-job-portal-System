async function register() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: "user"
  };

  const res = await fetch("http://localhost:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.text();
  alert(result);
}

async function login() {
  const data = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  const res = await fetch("https://smart-job-portal-system-eftt.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  console.log("LOGIN RESPONSE:", result);
  // Save token
  localStorage.setItem("token", result.token);

  alert(result.message);
}

async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://smart-job-portal-system-etft.onrender.com", {
    method: "GET",
    headers: {
      "authorization": "Bearer " + token
    }
  });

  const result = await res.text();
  alert(result);
}