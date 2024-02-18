const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password)
    return res.status(400).send({ message: "Username and password are required" });

  const existingUser = users.filter(user => user.username === username);
  if (existingUser.length>0)
    return res.status(400).send({ message: "Username already exists" });
  
  users.push({ username, password });
  res.status(200).send({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) { // async await
  //Write your code here
  const booksList = await JSON.stringify(books);
  return res.status(200).send(booksList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBooksInfoByISBN(isbn)
  .then(bookInfo=>{
    return res.status(200).send(bookInfo);
  })
  .catch(err=>{
    return res.status(404).json({message:err});
  });
 });
function getBooksInfoByISBN(isbn){
  return new Promise((resolve,reject)=>{
    if(books[isbn]) 
      resolve(books[isbn]);
    else
      reject("Book Not Found");
  });
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksList = [];
  for(let key in books){
    let book = books[key];
    if(book.author === author)
      booksList.push(book);
  }
  if(booksList.length>0)
    return res.status(200).send(JSON.stringify(booksList));

  return res.status(404).json({message: "Author has no books"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksList = [];
  for(let key in books){
    let book = books[key];
    if(book.title === title)
      booksList.push(book);
  }
  if(booksList.length>0)
    return res.status(200).send(JSON.stringify(booksList));

  return res.status(404).json({message: "Author has no books"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const reviews = book['reviews'];
  
  return res.status(200).send(JSON.stringify(reviews));
});

module.exports.general = public_users;
