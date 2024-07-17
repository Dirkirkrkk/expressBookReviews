const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const user = req.body.user;
  const password = req.body.password;
  
  if (!user || !password) {
    return res.status(404).send("Username or password not provided.");
  }
 
  if (users[user]) {
    return res.status(404).send("Username '" + user + "' already registered.");
  }

  users[user] = password;
  res.status(200).send("Customer successfully registered. You can now login.\n" + users);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered_books = Object.values(books)
    .filter((book) => book.author === author)
    .map((book) => ({
      isbn: Object.keys(books).find(key => books[key] === book),
      title: book.title,
      reviews: book.reviews
    }));
  res.send({ booksbyauthor: filtered_books });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = Object.values(books)
    .filter((book) => book.title === title)
    .map((book) => ({
      isbn: Object.keys(books).find(key => books[key] === book),
      author: book.author,
      reviews: book.reviews
    }));
  res.send({booksbytitle: filtered_books});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
