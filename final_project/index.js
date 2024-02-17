const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const secret = "fb7dfd008534ec267dddf0200556c7cb9eb2205e5f2e7a3f670fe885f540a056";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.headers.authorization;
    if(!token)
        res.status(401).json({"message":"No Token Provided"});
    
    jwt.verify(token,secret,(err,decode)=>{
        if(err)
            res.status(401).json({"message":"Invalid Token"});
        req.username = decode.user;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
