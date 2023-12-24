require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const User = require('./model/user_schema')
const Visitor = require('./model/visitor_schema')
const Pass = require('./model/vpass_schema')

mongoose.connect('mongodb+srv://zhaotian:2ozMtEmv8cIhvGS9@cluster0.azxhyf5.mongodb.net/vms?retryWrites=true&w=majority')   //stored to 'vms'

//connect to mongodb
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

app.use(express.json())

// app.get('/', (req, res) => {
//    res.send('Hello World! Its me, Mario!')
// })

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
     tags:[
      { name: 'Login', description: 'Login endpoints' },
      { name: 'User', description: 'User API' },
      { name: 'Host', description: 'Host API' },
      { name: 'Admin', description: 'Admin API' }
    ],
    components: {
      securitySchemes: {
          Authorization: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              value: "Bearer <JWT token here>",
              description:"this is for authentication only, to log out, please use the logout api"
          }
        }
      },
     servers:[
       {
           //url: 'https://isbenr3433.azurewebsites.net/'
           url: 'http://localhost:3000'
       }
     ]
   },
   apis: ['./app.js'], // files containing annotations as above
 };

 const openapiSpecification = swaggerJsdoc(options);
 app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

 
//  //hell0 world swagger
// /**
// * @swagger
// * /:
// *  get:
// *      tags: [Test]
// *      summary: This api is for testing
// *      description: This api is used for testing
// *      responses:
// *          200:
// *              description: to test get api
// */

// //hello world function
// app.get('/', (req, res) => {
//   res.send('Hello World! zt')
// })

//admin routes
//app.use('/admin',adminRouter);

//register swagger
/**
* @swagger
* /register:
*  post:
*      tags: [User]
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
*                    schema:
*                      type: object
*                      properties:
*                          user:
*                              $ref: '#components/schema/registersuccessful'
*                          
*          409:
*              description: Username has been taken
*          500:
*              description: Internal server error
*              content:
*                  application/json:
*                    schema:
*                       type: object
*                       properties:
*                          message:
*                             $ref: '#components/schema/errormessage'
*/

//register function
app.post('/register', async(req, res) => {
   try {
       const { username, password, name} = req.body;
       const a = await User.findOne({'username':req.body.username})
       if(a == null){
         const request ={
           username: username,
           password: password,
           name: name,
           role: "User",
           login_status: false
         }  
         const user = await User.create(request)
         const responsemessage= 'User ' + username + ' registered successfully';
         res.status(200).json({user:user, message: responsemessage})}
       else{
           res.status(409).send('Username has been taken'); // 409 = there's a conflict that needs to be resolved before the request can be successfully processed
       }        
   } catch (error) {
       console.log(error.message);
       res.status(500).json({message: error.message})
   }
})

//register schema
/**
* @swagger
*  components:
*      schema:
*          registerinfo:
*              type: object
*              properties:
*                  username:
*                      type: string
*                  password: 
*                      type: string
*                  name:
*                      type: string
*          registersuccessful:
*              type: object
*              properties:
*                  username:
*                      type: string
*                  name:
*                      type: string
*                  message:
*                      type: string
*                      description: Additional message
* 
*          errormessage:
*              type: object
*              properties:
*                message:
*                  type: string
*                  example: Internal server error occurred
* 
*          jwtinfo:
*            type: object
*            properties:
*              username:
*                type: string
*              user_id: 
*                type: string
*              role:
*                type: string
* 
*          User:
*              type: object
*              properties:
*                  username:
*                      type: string
*                  password:
*                      type: string 
*                  name:
*                      type: string 
*                  role:
*                      type: string 
*                  visitor_id:
*                      type: string 
*                      format: uuid
*                  login_status:
*                      type: boolean
*/

//login swagger
/**
 * @swagger
 *  /login:
 *    post:
 *      tags: [User]
 *      summary: Login for users
 *      description: this api fetch data from mongodb
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 username:
 *                  type: string
 *                 password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Successful login
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: Username of the logged-in user
 *                  message:
 *                    type: string
 *                    description: Login successful message
 *                  accesstoken:
 *                    type: string
 *                    description: Generated access token for the logged-in user
 *        401:
 *          description: Unauthorized - Wrong password
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Unauthorized Wrong password
 *        404:
 *          description: Username not found
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: Username not found
 *        409:
 *          description: User is already logged in
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: User is already logged in
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schema/errormessage'
 *                
 */

//login function
app.post('/login',async(req,res)=>{
  const {username,password}=req.body
  try {
    const b = await User.findOne({username:req.body.username})
    if(b==null){
      res.status(404).send('Username not found');
    }else{
      if(b.login_status==true){
        res.status(409).send('User is already logged in');
      }else{
        const c = req.body.password === b.password;      
        if(!c){
          res.status(401).send('Unauthorized: Wrong password');
        }else{
        await User.updateOne({username:req.body.username},{$set:{login_status:true}})
        const login_user= await User.findOne({username:req.body.username})
        access_token=jwt.sign({username:login_user.username,user_id:login_user._id,role:login_user.role},process.env.JWT_SECRET)
        res.json({username:login_user.username,message:"login successful",accesstoken: access_token})
      }
      }
      }}
   catch (error) {
    console.log(error.message);
        res.status(500).json({message: error.message})
  }
})

//middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, login_user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = login_user
    next()
  })
}

//show jwt swagger
/**
 * @swagger
 *  /showjwt:
 *    get:
 *      tags: [Login]
 *      summary: Display user information from JWT token
 *      security:
 *        - Authorization: []
 *      responses:
 *        200:
 *          description: Successful retrieval of user information
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schema/jwtinfo'
 *                description: User information retrieved from JWT token
 *        401:
 *          description: Unauthorized - Invalid or missing token
 *          
 */

//test jwt
app.get('/showjwt',authenticateToken,(req,res)=>{
  res.send(req.user)
})

//test schema
/**
 * @swagger
 *  components:
 *      schema:
 *          registerinfo:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  name:
 *                      type: string
 * 
 * 
 *          registersuccessful:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  name:
 *                      type: string
 *                  message:
 *                      type: string
 *                      description: Additional message
 * 
 *          errormessage:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Internal server error occurred
 * 
 *          jwtinfo:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              user_id: 
 *                type: string
 *              role:
 *                type: string
 * 
 *          User:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *                  name:
 *                      type: string 
 *                  role:
 *                      type: string
 *                  visitor_id:
 *                      type: string
 *                      format: uuid
 *                  login_status:
 *                      type: boolean
 */

//logout swagger
/**
* @swagger
*  /logout:
*   post:
*      tags: [User]
*      description: This api is used for logout
*      summary: Logout for users
*      security:
*        - Authorization: []
*      responses:
*        200:
*          description: Successful logout
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  username:
*                    type: string
*                    description: Username of the logged-out user
*                  message:
*                    type: string
*                    description: Logout successful message
*        401:
*          description: Unauthorized - Invalid or missing token
*        500:
*          description: Internal server error
*          content:
*            application/json:
*              schema:
*                 $ref: '#components/schema/errormessage'
*                
*/

//logout function
app.post('/logout',authenticateToken,async(req,res)=>{
  try {
    await User.updateOne({username:req.user.username},{$set:{login_status:false}})
    res.json({username:req.user.username,message:"logout successful"})
  } catch (error) {
    console.log(error.message);
        res.status(500).json({message: error.message})
  }
})

//logout schema
/**
* @swagger
*  components:
*       schema:
*          registerinfo:
*              type: object
*              properties:
*                  username:
*                      type: string
*                  password:
*                      type: string
*                  name:
*                      type: string
* 
* 
*          registersuccessful:
*              type: object
*              properties:
*                  username:
*                      type: string
*                  name:
*                      type: string
*                  message:
*                      type: string
*                      description: Additional message
* 
*          errormessage:
*              type: object
*              properties:
*                message:
*                  type: string
*                  example: Internal server error occurred 
* 
*          jwtinfo:
*            type: object
*            properties:
*              username:
*                type: string
*              user_id: 
*                type: string
*              role:
*                type: string
* 
*          User:
*              type: object
*              properties:
*                  username:
*                      type: string 
*                  password:
*                      type: string
*                  name:
*                      type: string 
*                  role:
*                      type: string
*                  visitor_id:
*                      type: string
*                      format: uuid
*                  login_status:
*                      type: boolean
*/

//create visitor swagger
 /**
 * @swagger
 *  /createvisitor:
 *    post:
 *      summary: Create visitor
 *      description: This api is used for creating visitor
 *      tags: [User]
 *      security:
 *        - Authorization: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 name:
 *                  type: string
 *                 phoneNumber:
 *                  type: number
 *      responses:
 *        200:
 *          description: Successful creation of visitor
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  visitor:
 *                    $ref: '#components/schema/visitor'
 *                  message:
 *                    type: string
 *                    description: Creation successful message
 *        401:
 *          description: Unauthorized - Invalid or missing token
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schema/errormessage'
 *                
 */

//create visitor function
app.post('/createvisitor',authenticateToken,async(req,res)=>{
  try {
    const {name,phoneNumber}=req.body
    const request ={
      name: name,
      phoneNumber: phoneNumber
    }
    const visitor = await Visitor.create(request)
    await User.updateOne({username:req.user.username},{$set:{visitor_id:visitor._id}})
    res.json({visitor:visitor,message:"visitor created successfully"})
  } catch (error) {
    console.log(error.message);
        res.status(500).json({message: error.message})
  }
})

//create visitor schema
/**
 * @swagger
 *  components:
 *        schema:
 *            visitor:
 *                type: object
 *            properties:
 *                name:
 *                type: string
 *            phoneNumber:
 *                type: number
 *            _id:
 *                type: string
 *                format: uuid
 *            createdAt:
 *                type: string
 *                format: date-time
 *            updatedAt:
 *                type: string
 *                format: date-time
 */ 
 
//create pass swagger
/**
 * @swagger
 *  /createpass:
 *    post:
 *      tags: [Users]
 *      description: This api is used for creating visitor pass
 *      summary: Create visitor pass
 *      security:
 *        - Authorization: []
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    purposeOfVisit:
 *                      type: string
 *                    phoneNumber:
 *                      type: number
 *      responses:
 *        200:
 *          description: Successful creation of visitor pass
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    vpass:
 *                      $ref: '#components/schema/vpass'
 *                  message:
 *                    type: string
 *                    description: Creation successful message
 *        401:
 *          description: Unauthorized - Invalid or missing token
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schema/errormessage'
 * 
 */






//admin create new host account
// authenticatedhost to see all created visitor
// authenticated user to issue vPass
// visitor to retrieve the pass 
// show user data once successful login 