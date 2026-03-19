const cors = require("cors");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Database connection
const db = mysql.createConnection({
  host: "containers-us-west-xxx.railway.app",
  user: "root",
  password: "xUqDvjyIOmPpREjZCRsrRIWriWPDYihD",
  database: "railway",
  port: 3306
});

db.connect(err => {
  if (err) throw err;
  console.log("Database Connected");
});

// Register API
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) return res.send(err);
    res.send("User Registered");
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

// LOGIN API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.query(sql, [email], async (err, result) => {
    if (err) return res.send(err);

    if (result.length > 0) {
      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // TOKEN GENERATE
        const token = jwt.sign(
          { id: user.id, email: user.email },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.json({
          message: "Login Successful",
          token: token
        });
      } else {
        res.send("Wrong Password");
      }
    } else {
      res.send("User not found");
    }
  });
});

// only those will access how have tokens
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.send("Access Denied");
  }

  // Bearer TOKEN se TOKEN nikalna
  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.send("Invalid Token");
  }
}

app.get("/profile", verifyToken, (req, res) => {
  res.send("Welcome User: " + req.user.email);
});

//job add(Recruiter)
app.post("/add-job", (req, res) => {
  const { title, company } = req.body;

  const sql = "INSERT INTO jobs (title, company) VALUES (?, ?)";

  db.query(sql, [title, company], (err, result) => {
    if (err) return res.send(err);
    res.send("Job Added");
  });
});

// job list
app.get("/jobs", (req, res) => {
  db.query("SELECT * FROM jobs", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});