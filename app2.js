const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const adminRouter = require('./route/admin');
const loginRouter = require('./route/login');
const hostRouter = require('./route/host');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');

//must be on top, before all route
app.use(express.json());

mongoose.connect('mongodb+srv://zhaotian:2ozMtEmv8cIhvGS9@cluster0.azxhyf5.mongodb.net/vms2?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use('/', loginRouter); // Use the login route at the root
app.use('/admin',adminRouter);
app.use('/host', hostRouter);

const options = {
    definition:{
        openapi: "3.0.3",
        info:{
            title: "Visitor Management System BERR G6",
            version: "0.1",
            description:"Visitor Management System with admin, host, visitors. A system to issue visitors pass and store the record into the cloud database, Mongodb Atlas.",
            contact:{
                name: "Hee Yee Cinn",
                url:"cinn.com",
                email:"b022110115@student.utem.edu.my"
            },

        },
        tags:[
            {name:'Login', description:"Default endpoints"},
            {name: 'Admin', description:"Admin operation"},
            {name: 'Host', description:"Host operation"},
        ],
        components:{
            securitySchemes:{
                Authorization:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    value: "Bearer <JWT token here>",
                    description: "This is for authentication, you must logout to change the JWT token"
                }
            }
        },
        servers: [
            {
                url:"http://localhost:3000/"
                // url:"https://swaggerg6.azurewebsites.net/"
            }
        ],
    },
    //all the route.js file store inside the route file 
    apis:["./route/*.js"],
};

const spacs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));
// must be placed below after all route
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


//admin create new host account
// authenticatedhost to see all created visitor
// authenticated user to issue visitor pass
// visitor to retrieve the pass 
// show user data once successful login 