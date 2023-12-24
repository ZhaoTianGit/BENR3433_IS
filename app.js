require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
//const adminRouter = require('./route/admin');
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
      { name: 'default', description: 'Default endpoints' },
      { name: 'Admin', description: 'Admin API' },
      { name: 'Host', description: 'Host API' },
      { name: 'User', description: 'User API' }
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

//admin routes
//app.use('/admin',adminRouter);

//register swagger
/**
 * @swagger
* /register:
*  post:
*      summary: registration for new user
*      tags: [User]
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

//register new user
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
 *      summary: Login for users
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
 *        404:
 *          description: Username not found
 *        409:
 *          description: User is already logged in
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#components/schema/errormessage'
 *                
 */

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

/**
 * @swagger
 *  /showjwt:
 *    get:
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


//admin create new host account
// authenticatedhost to see all created visitor
// authenticated user to issue vPass
// visitor to retrieve the pass 
// show user data once successful login 