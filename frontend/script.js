//function of register process
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

//function of login process
async function login() {
  const data = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  console.log("LOGIN RESPONSE:", result);
  
  localStorage.setItem("token", result.token);

  alert(result.message);
}

//get profile
async function getProfile() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/profile", {
    method: "GET",
    headers: {
      "authorization": "Bearer " + token
    }
  });

  const result = await res.text();
  alert(result);
}

//shows the available jobs
async function loadJobs() {
  const res = await fetch("http://localhost:5000/jobs");
  const data = await res.json();

  let output = "";

  data.forEach(job => {
    output += `
      <div>
        <h3>${job.title}</h3>
        <p>${job.company}</p>
        <button onclick="applyJob(${job.id})">Apply</button>
        <hr>
      </div>
    `;
  });

  document.getElementById("jobs").innerHTML = output;
}

//it help to apply jobs
async function applyJob(jobId) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/apply-job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      user_id: 1, 
      job_id: jobId
    })
  });

  const result = await res.text();
  alert(result);
}

//shows application status
async function myApplications() {
  const res = await fetch("http://localhost:5000/my-applications");
  const data = await res.json();

  let output = "";

  data.forEach(job => {
    output += `
      <div>
        <h3>${job.title}</h3>
        <p>${job.company}</p>
        <p>Applied ✅</p>
        <hr>
      </div>
    `;
  });

  document.getElementById("myJobs").innerHTML = output;
}

//add jobs
async function addJob() {
  const data = {
    title: document.getElementById("jobTitle").value,
    company: document.getElementById("company").value
  };

  const res = await fetch("http://localhost:5000/add-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.text();
  alert(result);
}