const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { // returns boolean
  let usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length > 0;
};

const authenticatedUser = (username, password) => { // returns boolean
  let validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 8: Add or modify a book review (protected by /customer/auth/*)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const filtered_book = books[isbn];

  if (filtered_book) {
    const review = req.query.review;
    const reviewer = req.session.authorization['username'];

    if (review) {
      filtered_book['reviews'][reviewer] = review;
      books[isbn] = filtered_book;
    }

    return res.status(200).json({
      message: `The review for the book with ISBN ${isbn} has been added/updated.`,
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "Unable to find book!" });
  }
});

// Task 9: Delete a book review (protected by /customer/auth/*)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewer = req.session.authorization['username'];
  const filtered_book = books[isbn];

  if (filtered_book) {
    delete filtered_book['reviews'][reviewer];
    return res.status(200).json({
      message: `Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.`
    });
  } else {
    return res.status(404).json({ message: "Unable to find book!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
