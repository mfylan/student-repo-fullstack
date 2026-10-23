const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5001;

// http://localhost:5001/form should return a form with input elements for username, email, and submit button

// http://localhost:5001/submit should return all the data the user entered

// Parses <form> bodies (application/x-www-form-urlencoded) into req.body
app.use(express.urlencoded({ extended: false }));

// Escape user input before putting it in HTML so it can't inject markup/scripts
const escapeHtml = function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

app.post("/submit", (req, res) => {
  const { username, email, comments, newsletter } = req.body;

  // An unchecked checkbox is not sent at all, so its presence means "yes"
  const signedUp = newsletter === "on" ? "Yes" : "No";

  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Form Submitted</title>
</head>
<body>
  <h1>Thanks for submitting!</h1>
  <ul>
    <li><strong>Username:</strong> ${escapeHtml(username)}</li>
    <li><strong>Email:</strong> ${escapeHtml(email)}</li>
    <li><strong>Comments:</strong> ${escapeHtml(comments)}</li>
    <li><strong>Newsletter sign up:</strong> ${signedUp}</li>
  </ul>
  <p><a href="/form">Back to the form</a></p>
</body>
</html>`);
});

// Visiting /submit sends people back to the form
app.get("/submit", (req, res) => {
  res.redirect("/form");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
