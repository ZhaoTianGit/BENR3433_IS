const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const adminRouter = require('./route/admin');

mongoose.connect('mongodb+srv://zhaotian:2ozMtEmv8cIhvGS9@cluster0.azxhyf5.mongodb.net/vms?retryWrites=true&w=majority')   //stored to 'vms'

//connect to mongodb
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

app.use(express.json())

app.get('/', (req, res) => {
   res.send('Hello World! Its me, Mario!')
})

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})

//admin routes
app.use('/admin',adminRouter);


//admin create new host account
// authenticatedhost to see all created visitor
// authenticated user to issue visitor pass
// visitor to retrieve the pass 
// show user data once successful login 