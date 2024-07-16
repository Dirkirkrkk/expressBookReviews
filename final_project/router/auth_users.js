const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body.user;
  const password = req.body.password;

  if (!user || !password) {
    return res.status(404).send("Username or password not provided.");
  }

  if (!users[user]) {
    return res.status(404).send("Username '" + user + "' doesn't exist. Please register first.");
  }

  if (users[user] != password) { 
    return res.status(404).send("Invalid password for user '" + user + "'.");
  }

  // Generate JWT access token
  let accessToken = jwt.sign({
      data: user
  }, 'access', { expiresIn: 60 * 60 });

  // Store access token in session
  req.session.authorization = {
      accessToken
  }

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const user = req.query.user;

  books[isbn].reviews[user] = review;

  return res.status(200).send("Review for book with isbn " + isbn + " has been added/updated.");
});

regd_users.delete("/auth/reviewdelete/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const user = req.query.user;

  delete books[isbn].reviews[user];

  return res.status(200).send("Reviews for book with isbn " + isbn + " from user " + user + " deleted.");
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
