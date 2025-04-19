const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./Config/mongodb');
const cookieParser = require('cookie-parser');
const myRouter = require('./Routings/authRoutes');

require("dotenv").config();

app.use(cors());

connectDB();

app.use(express.json());
app.use("/api/auth",myRouter);

app.get("/homePage",(req,res)=>{
    res.send("This is my Home Page");
})

app.listen(process.env.PORT,(req,res)=>{
    console.log("App is running...");
});