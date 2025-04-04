const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    const usernamePattern = /^[a-zA-Z0-9_]{3,}$/;

    return usernamePattern.test(username);
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.body;

    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Save or modify the review
    book.reviews[username] = review;
    
    return res.status(200).json({
        message: book.reviews[username] === review ? "Review posted successfully" : "Review updated successfully"
    });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
        // Extract email parameter from request URL
        const { isbn } = req.params;
        const { review } = req.body;
        const username = req.body;
        if (!username) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
    
        if (!review) {
            return res.status(400).json({ message: "Review text is required" });
        }
    
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
    
        // Save or modify the review
        book.reviews[username] = review;
        res.send(`review with the username ${review} deleted.`);
    });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;