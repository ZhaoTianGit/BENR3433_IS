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

//admin route
//app.use('/admin',adminRouter);

//register swagger
/**
* @swagger
* /register:
*  post:
*      tags: [Admin]
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
    const user = await User.findOne({username:req.body.username})
    if(user==null){
      res.status(404).send('Username not found');
    }else{
      if(user.login_status==true){
        res.status(409).send('User is already logged in');
      }else{
        const c = req.body.password === user.password;      
        if(!c){
          res.status(401).send('Unauthorized: Wrong password');
        }else{
        await User.updateOne({username:req.body.username},{$set:{login_status:true}})
        const login_user= await User.findOne({username:req.body.username})
        access_token=jwt.sign({username:login_user.username,user_id:login_user._id,role:login_user.role},process.env.JWT_SECRET)
        res.json({username:login_user.username,message:"login successful",accesstoken: access_token,_id:login_user._id,redirectLink:`/${login_user.role}/${login_user._id}`})
      }
      }
      }}
   catch (error) {
    console.log(error.message);
        res.status(500).json({message: error.message})
  }
})

//login swagger2
/**
* @swagger
* /login2:
*  post:
*    tags: [Login]
*    summary: Login for admin or host
*    description: Once login authenticate a user and generate a JWT token
*    requestBody:
*      required: true
*      content: 
*          application/json:
*              schema:
*                  type: object
*                  properties:
*                      username:
*                          type: string
*                      password:
*                          type: string
*    responses:
*      200:   
*          description: Successful login
*          schema: 
*              type: object    
*              properties:
*                  token: 
*                      type: string
*                      description: JWT token for authentication
*                  category: 
*                      type: string
*                      description: User category (host or admin)
*                  redirectLink:
*                      type: string
*                      description: Redirect link based on user category
*                  GET:
*                      type: string
*                      description: URL to be used for redirection
*                  Authorization:
*                      type: string
*                      description: JWT token for authorization
*                  Content-Type: 
*                      type: string
*                      description: Response content type
*      401:
*          description: Invalid credentials
*          schema: 
*              type: object
*              properties:
*                  error:  
*                      type: string
*                      description: Error message
*                      example: Invalid credentials
*      404:
*          description: Username not found
*          schema:
*              type: object
*              properties:
*                  error:
*                      type: string
*                      description: Error message
*                      example: Username not found
*      409:
*          description: User is already logged in
*          schema:
*              type: object
*              properties:
*                  error:
*                      type: string
*                      description: Error message
*                      example: User is already logged in
*      500: 
*          description: Internal Server Error
*          schema: 
*              type: object
*              properties: 
*                  error:
*                      type: string
*                      description: Error message
*                      example: Internal Server Error
*               
*/

//login function2
app.post('/login2',async(req,res)=>{
  const {username,password}=req.body
  try {
    const {username,password}=req.body
    const user = await User.findOne({username:req.body.username})

    if(!user) {
      res.status(401).json({error: 'Invalid credentials'})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      res.status(401).json({error: 'Invalid credentials'})
    }

    const token = jwt.sign({userId: user._id, category: user.category}, 'vms2', {
      expiresIn: '1h',
    });

    let redirectLink;
    if(user.category === 'host') {
      redirectLink = `/host/${user._id}`;
    } else if(user.category === 'admin') {
      redirectLink = `/admin`;
    } else {
      redirectLink = `/`;
    }

    console.log("JWT:",token);
    res.json({
      token,
      category: user.category,
      redirectLink,
      "GET": `http://localhost:3000${redirectLink}`,
      Authorization: token,
      "Content-Type": "application/json",
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
})  

//login schema2
/**
 * components:
 *   schemas:
 *     Visit:
 *       type: object
 *       required:
 *         - purposeOfVisit
 *         - phoneNumber
 *       properties:
 *         purposeOfVisit:
 *           type: string
 *           description: The purpose of the visit
 *         phoneNumber:
 *           type: number
 *           description: The phone number of the visitor
 *         visitTime:
 *           type: string
 *           format: date-time
 *           description: The time of the visit
 *       example:
 *         purposeOfVisit: Meeting
 *         phoneNumber: 1234567890
 *
 *     Visitor:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the visitor
 *         visits:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Visit'
 *       example:
 *         name: John Doe
 *         visits:
 *           - purposeOfVisit: Meeting
 *             phoneNumber: 1234567890
 *             visitTime: '2023-01-01T12:00:00Z'
 *
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - phoneNumber
 *         - category
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         phoneNumber:
 *           type: number
 *           description: The phone number of the user
 *         category:
 *           type: string
 *           enum:
 *             - host
 *             - admin
 *           description: The category of the user (host or admin)
 *         visitors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Visitor'
 *       example:
 *         username: user123
 *         password: password123
 *         email: user@exa\mple.com
 *         phoneNumber: 1234567890
 *         category: host
 *         visitors:
 *           - name: John Doe
 *             visits:
 *               - purposeOfVisit: Meeting
 *                 phoneNumber: 1234567890
 *                 visitTime: '2023-01-01T12:00:00Z'
 */

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
 *                  name:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                  purposeOfVisit:
 *                    type: string
 *      responses:
 *        200:
 *          description: Successful creation of visitor
 *        400:
 *          description: Bad request
 *          content:
 *           text/plain:
 *            schema:
 *              type: string
 *              example: Bad request
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
app.post('/createVisitor',authenticateToken,async(req,res)=>{
  try {
    const {name,phoneNumber}=req.body
    const request ={
      name: name,
      phoneNumber: phoneNumber,
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
 *                properties:
 *                    name:
 *                      type: string
 *                    phoneNumber:
 *                      type: string
 */ 
 
//create pass swagger
/**
 * @swagger
 *  /createpass:
 *    post:
 *      tags: [User]
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
 *                      type: string
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
 *                      message:
 *                        type: string
 *                        description: Creation successful message
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

//create pass function
app.post('/createpass',authenticateToken,async(req,res)=>{
  try {
    const {purposeOfVisit,phoneNumber}=req.body
    const request ={
      purposeOfVisit: purposeOfVisit,
      phoneNumber: phoneNumber
    }
    const vpass = await Pass.create(request)
    await Visitor.updateOne({phoneNumber:req.body.phoneNumber},{$push:{visitor_pass_id:vpass._id}})
    res.json({vpass:vpass,message:"visitor pass created successfully"})
  } catch (error) {
    console.log(error.message);
        res.status(500).json({message: error.message})
  }
})

//create pass schema
/**
 * @swagger
 *  components:
 *        schema:
 *            vpass:
 *                type: object
 *                properties:
 *                  purposeOfVisit:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 */ 





//admin create new host account
// authenticatedhost to see all created visitor
// authenticated user to issue vPass
// visitor to retrieve the pass 
// show user data once successful login 