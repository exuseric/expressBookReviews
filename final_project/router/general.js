const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & 10: Get the book list available in the shop (async-await)
public_users.get('/', async function (req, res) {
  try {
    const booksData = await new Promise((resolve) => resolve(books));
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2 & 11: Get book details based on ISBN (Promise)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 3 & 12: Get book details based on author (async-await)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = await new Promise((resolve) => {
      const keys = Object.keys(books);
      const result = keys
        .filter((key) => books[key].author === author)
        .map((key) => ({
          isbn: key,
          author: books[key].author,
          title: books[key].title,
          reviews: books[key].reviews,
        }));
      resolve(result);
    });
    res.send(JSON.stringify({ booksbyauthor: booksByAuthor }, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 4 & 13: Get all books based on title (async-await)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = await new Promise((resolve) => {
      const keys = Object.keys(books);
      const result = keys
        .filter((key) => books[key].title === title)
        .map((key) => ({
          isbn: key,
          author: books[key].author,
          title: books[key].title,
          reviews: books[key].reviews,
        }));
      resolve(result);
    });
    res.send(JSON.stringify({ booksbytitle: booksByTitle }, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    if (Object.keys(reviews).length > 0) {
      res.send(JSON.stringify(reviews, null, 4));
    } else {
      res.status(200).json({ message: "No reviews found for this book." });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
