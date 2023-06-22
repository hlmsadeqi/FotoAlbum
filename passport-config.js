const LocalStrategy = require('passport-local').Strategy
const bcrypt = require ('bcrypt')
const db = require('./db.js');
var test=null;
function initialize(passport, getUserByEmail, getUserById) {
    console.log("Hello World");
    console.log(getUserByEmail);

    const authenticateUser = async(email, password, done) => {
        console.log(email);
         var isUser = await db.checkCredentials(email,password)
      
       // const user = {email:"gf",password:"h"}//getUserByEmail(email)
        if (!isUser) {
            return done(null, false, { message: 'No user with that email or Credentials'})
        }
        console.log("Hello World12");
        const user = db.getUser(email,password)
      
        try{
            return await done(null, user)
       } catch(e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'},authenticateUser))
   passport.serializeUser((user, done) => done(null, user))
   passport.deserializeUser( (user, done) => { 
        
    return done(null,getUserByEmail) });
}

module.exports = initialize