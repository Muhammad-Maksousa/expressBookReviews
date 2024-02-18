const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secret = "fb7dfd008534ec267dddf0200556c7cb9eb2205e5f2e7a3f670fe885f540a056";

let users = [{
  "username" : "muhammad",
  "password" : "12345"
}];

const isValid = (username)=>{ //returns boolean
  let matches = users.filter((user)=> user.username===username)
  return matches.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let matche = users.find((user)=> user.username===username && user.password===password)
  return matche;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password)
    return res.status(404).json({message: "something is missing"});
  if(authenticatedUser(username,password)){
    let token = jwt.sign({user:username},secret,{expiresIn:60*60});
    return res.status(200).json({message:"user logged in ",token : token});
  }else
    return res.status(401).json({message:"Invalid username or password"});
});

// Add a book review
regd_users.put("/auth/review", (req, res) => {
  const isbn = req.body.isbn;
  const review = req.body.review;
  const username = req.username;
  if(books[isbn]){
    if(!books[isbn].reviews)
      books[isbn].reviews = {};
    books[isbn].reviews[username] = review;
    return res.status(200).json({message:"Review added/modified Successfully"});
  }else{
    return res.status(404).json({message: "Book Not Found"});
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.username;

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({ message: "Review deleted successfully" });
  } else {
      res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
