const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Async-Await with Axios
public_users.get('/', async function (req, res) {
  try {
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
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
  .catch((err) => res.status(404).json({message: err}));
 });
  
// Task 12: Get book details based on author using Async-Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let keys = Object.keys(books);
    let booksByAuthor = [];
    keys.forEach(key => {
        if (books[key].author === author) {
            booksByAuthor.push({
                "isbn": key,
                "author": books[key].author,
                "title": books[key].title,
                "reviews": books[key].reviews
            });
        }
    });
    res.send(JSON.stringify({booksbyauthor: booksByAuthor}, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books by author");
  }
});

// Task 13: Get all books based on title using Async-Await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    let keys = Object.keys(books);
    let booksByTitle = [];
    keys.forEach(key => {
        if (books[key].title === title) {
            booksByTitle.push({
                "isbn": key,
                "author": books[key].author,
                "title": books[key].title,
                "reviews": books[key].reviews
            });
        }
    });
    res.send(JSON.stringify({booksbytitle: booksByTitle}, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books by title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
