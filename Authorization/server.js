const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path'); // Import the 'path' module
const PORT = 3000;


// Temporary data storage (replace this with a proper database in a real project)
const users = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'html');
// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/homepage.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/homepage.html'));
});
app.get('/login-error', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login-error.html'));
});

app.get('/create-account', (req, res) => {
  res.sendFile(path.join(__dirname,'/views/create-account.html'));
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if the username already exists
  if (users.some((user) => user.username === username)) {
    res.send("Username already taken. Please choose a different username.");
  } else if (users.some((user) => user.email === email)) {
    res.send("Email already registered. Please use a different email.");
  } else {
    users.push({ username, email, password });
    res.redirect('/dashboard?email=' + email);
  }
}); // Store username along with email and password

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (user) => (user.email === email || user.username === email) && user.password === password
  );
  if (!user) {
    res.redirect('/login-error');
  } else {
    res.redirect('/dashboard?email=' + user.email);
  }
});

app.get('/dashboard', (req, res) => {
  const email = req.query.email;
  const user = users.find((user) => user.email === email);
  if (!user) {
    res.redirect('/login');
  } else {
    res.sendFile(path.join(__dirname, '/views/dashboard.html'), { username: user.username }); // Pass the 'username' variable to the template
  }
});

app.get('/logout', (req, res) => {
  // Perform any logout actions if needed
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
