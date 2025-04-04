const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const doesExist = (username) => {
        // Filter the users array for any user with the same username
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        // Return true if any user with the same username is found, otherwise false
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
    
});
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from request params

    if (books[isbn]) {
        res.status(200).json(books[isbn]); // Send book details as JSON
    } else {
        res.status(404).json({ message: "Book not found" }); // If ISBN not found, return error
    }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLocaleLowerCase();
  const results = Object.entries(books)
  .filter(([id, book]) => book.author.toLowerCase() === author)
  .map(([id, book]) => ({ id, ...book }));

    if (results.length > 0) {
    res.json(results);
    } else {
    res.status(404).json({ message: "No books found by that author." });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLocaleLowerCase();
  const results = []
  for (let id in books) {
    if (books[id].title.toLowerCase() === title) {
        results.push({ id, ...books[id] });
        }
    }
    if (results.length) {
    res.json(results);
    } else {
    res.status(404).json({ message: "No books found with that title." });
    }
 return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from request params

  if (books[isbn]) {
      res.status(200).json(books[isbn].reviews); // Send book details as JSON
  } else {
      res.status(404).json({ message: "reviews not found" }); // If ISBN not found, return error
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
