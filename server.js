if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const PORT = 5000
const bodyParser = require('body-parser')

const formidable = require('formidable');
const path = require('path');
let bilder //= require('./data/bilder');
const fs = require('fs');
//const bcrypt = require ('bcrypt') 
const passport = require ('passport')
const flash = require('express-flash')
const seesion = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require ('./passport-config')

const users = []  //local variable
var user;
//befehl für connect to view
app.set('view engine' , 'ejs')
app.use(express.static(__dirname + "/views/"));
app.use('/data/bilder', express.static('data/bilder')); 
app.use(bodyParser.json())  
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash())
app.use(seesion({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
const db = require('./db.js');


// (ich rufe damit index.html in server )
app.get('/',async(req,res )=>{ 
   /* 
   bilder.forEach(bild =>{
        console.log(bild);
        if(bild.active===true)
        db.createBilder(0,bild.path,1,bild.description,bild.name)
        else
        db.createBilder(1,bild.path,1,bild.description,bild.name)

    })*/
    //await db.createBilder();                       //checkAuthenticated,
  console.log(req.isAuthenticated());
  if(!req.isAuthenticated()){
    res.redirect("/login")
    return
  }   
  
  bilder = await db.getBilerByUserId(user.user_id)
  res.render('index.ejs', {bild:bilder,user:user});
});



//Edit button for bilder
app.post('/update', async (req,res)=>{
    await db.updateBilder(req.body.active,req.body.bild_id,req.body.description,req.body.name)
   
    res.redirect('/');
})
//login&register
app.get('/login',checkNotAuthenticated, (req,res) => {
    res.render('login.ejs')
})

app.post('/login',checkLogin, passport.authenticate('local', 
    {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',checkNotAuthenticated, (req,res) => {
    res.render('register.ejs',{Error:""})
})

app.post('/register',checkNotAuthenticated, async (req,res) =>{
    console.log(await db.isMailExisting(req.body.email));
    let isMailExisting = await db.isMailExisting(req.body.email);
    if (isMailExisting) {
        res.render('register.ejs',{Error:"Die Mail Existiert bereits"}) 
        return;   
    }else{
        //res.render('register.ejs',{Error:"Die Mail Existiert noch nicht"}) 
         db.createUser( req.body.email,req.body.password,req.body.name);
        res.redirect('/login');
        return; 
    }
})


async function checkLogin(req,res,next){
   
    if (req.isAuthenticated()) {
        res.redirect('/')
    }
    initializePassport(
        passport, 
        req.body.email ,
        req.body.password
    )
    user = await db.getUserByUsername(req.body.email);
    next()
    
}
function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()) {
         res.redirect('/')
    }
    next()
}

app.post('/logout', (req, res) => {

req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });

})

//endeLogin&register&logout

//collection.insertMany([users]) //insert in database

console.log(bilder);

/*
// ein Bild anzeigen
app.get('/bilder/get/:id', function(req,res){
    if(!req.isAuthenticated()){
        res.redirect("/login")
        return
    }   
    var bild = bilder.find(dataset =>{
        if(dataset.id == req.params.id){
            return dataset;
        }
    });
    if(bild === undefined){  //wenn keine bild mit params.id es gibt
        res.status(404).json({
            succuss : false
        })
    }
    else{
        res.status(200).json({
        data : bild ,
        succuss: true
    })}; 
    
})


//alle bilder wo isActive 
app.get('/bilder/active', function(req,res){
    let isactive= [] ;
    bilder.forEach(element => {
        if (element.active == true){
            isactive.push(element);
            console.log("isactive")
        }
    });
    res.status(200).json({
        data : isactive ,
        succuss: true
    }); 
    });


//alle bilder wo isNotActive 
app.get('/bilder/inactive', function(req,res){
    let isNotactive= [] ;
    bilder.forEach(element => {
        if (element.active == false){
            isNotactive.push(element);
            console.log("isNotactive")
        }
    });
    res.status(200).json({
        data : isNotactive ,
        succuss: true
    }); 
    });
//
//upload neue bild
app.get('/', (req, res) => {
  
    res.send(`/views/index.ejs`);
});

*/
//upload Bilder mit formidable
app.post('/data/create/bilder', (req, res) => {
    // const form = formidable({ multiples: true });
     if(!req.isAuthenticated()){
         res.redirect("/login")
         return
     }    
     const form = new formidable.IncomingForm();
     var newPath = path.join(__dirname, 'data/bilder/')
     form.parse(req, (err, fields, files) => {     //alle fields in form
     if (err) {
         next(err);
         return;
     }
     console.log("files");
     console.log(files.file.newFilename);
     console.log(files);
     console.log(fields);
     let bildName = files.file.newFilename+files.file.originalFilename;
     console.log(newPath+bildName);
     
     var rawData = fs.readFileSync(files.file.filepath)     //schieben bilder in fs(data/bilder)
     fs.writeFile(newPath+bildName, rawData, function(err){
         if(err) console.log(err)
         return ;
     })
    
     
    if(fields.active==="Active"){    //schieben bilder in database(mysql)
         db.createBilder(0,'data/bilder/'+bildName,user.user_id,fields.description,fields.name)
     }else{
         db.createBilder(1,'data/bilder/'+bildName,user.user_id,fields.description,fields.name)
     }
     });
     res.redirect('/')
 });


//web server herstellen
app.listen(5000,()=> console.log('Server Connected to port 5000'));