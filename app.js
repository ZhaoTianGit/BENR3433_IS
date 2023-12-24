require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const adminRouter = require('./route/admin');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const User = require('./mongodb_models/user_schema')
const Visitor = require('./mongodb_models/visitor_schema')
const Pass = require('./mongodb_models/vpass_schema')

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

const options = {
   definition: {
     openapi: '3.0.0',
     info: {
       title: 'BENR3433 INFORMATION SECURITY zt',
       version: '1.0.0',
     },
     servers:[
       {
           url: 'https://isbenr3433.azurewebsites.net/'
           //url: 'http://localhost:3000'
       }
     ]
   },
   apis: ['./app.js'], // files containing annotations as above
 };

 const openapiSpecification = swaggerJsdoc(options);
 app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

//admin routes
app.use('/admin',adminRouter);

//test swagger
/**
 * @swagger
 * /:
 *  get:
 *      summary: This api is for testing
 *      description: This api is used for testing
 *      responses:
 *          200:
 *              description: to test get api
 */
app.get('/', (req, res) => {
   res.send('Hello World! zt')
})

/**
* @swagger
* /register:
*  post:
*      summary: registration for new user
*      description: this api fetch data from mongodb
*      requestBody:
*          required: true
*          content:
*              application/json:
*                  schema:
*                      $ref: '#components/schema/registerinfo'
*      responses:
*          200:
*              description: added successfully
*              content:
*                 application/json:
*                  schema:
*                      type: object
*                      properties:
*                          user:
*                              $ref: '#components/schema/User'
*                          message:
*                              type: string
*                              description: Additional message
*          409:
*              description: Username has been taken
*          500:
*              description: Internal server error
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          properties:
*                              message:
*                                  type: string
*/

//register new user
// app.post('/register', async(req, res) => {
//    try {
//        const { username, password, name} = req.body;
//        const a = await User.findOne({'username':req.body.username})
//        if(a == null){
//          const request ={
//            username: username,
//            password: password,
//            name: name,
//            role: "user",
//            login_status: false
//          }  
//          const user = await User.create(request)
//          const responsemessage= 'User registered successfully';
//          res.status(200).json({user:user, message: responsemessage})}
//        else{
//            res.status(409).send('Username has been taken'); // 409 = there's a conflict that needs to be resolved before the request can be successfully processed
//        }        
//    } catch (error) {
//        console.log(error.message);
//        res.status(500).json({message: error.message})
//    }
// })

// /**
// * @swagger
// *  components:
// *      schema:
// *          registerinfo:
// *              type: object
// *              properties:
// *                  username:
// *                      type: string
// *                  password:
// *                      type: string
// *                  name:
// *                      type: string
// * 
// *          User:
// *              type: object
// *              properties:
// *                  username:
// *                      type: string
// *                  password:
// *                      type: string
// *                  name:
// *                      type: string 
// *                  role:
// *                      type: string
// *                  visitor_id:
// *                      type: string
// *                      format: uuid
// *                  login_status:
// *                      type: boolean
// */

//admin create new host account
// authenticatedhost to see all created visitor
// authenticated user to issue vPass
// visitor to retrieve the pass 
// show user data once successful login 