var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "halima",
  password: "halima",
  database: "bildersuche"
});

con.connect(function(err) {
  if (err)return null;
  console.log("Connected!");
});

function updateBilder(active,bild_id,description,name) {
  return  new Promise((resolve, reject)=>{
    var sql =`UPDATE bildersuche.bilder SET active=${active},description="${description}",name="${name}" WHERE bild_id=${bild_id}; `;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}

function getBilerByUserId(userId) {
  return  new Promise((resolve, reject)=>{
    var sql =`select * from bilder where user_id ='${userId}'`;
    con.query(sql, function (err, result,fields) {
      
        if(err){
            return reject(err);
        }
        
        if(result.length !=0){
          return resolve(result);
        }
        return resolve(null);
    });
  });
}
function createBilder(active,path,user_id,description,name){
  return  new Promise((resolve, reject)=>{    
  var sql =`INSERT INTO bilder (active,path,user_id,description,name) VALUES ('${active}','${path}','${user_id}','${description}','${name}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    });
}

function createUser(username, password, fullname) {
  return  new Promise((resolve, reject)=>{    
  var sql =`INSERT INTO users (mail, password,fullname) VALUES ('${username}','${password}','${fullname}')`;
      
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    });
}

//check ob mail adress im system hinterlegt ist.
function isMailExisting(mail){
  return  new Promise((resolve, reject)=>{
    var sql =`select * from users where mail ='${mail}'`;
    con.query(sql, function (err, result,fields) {
        if(err){
            return reject(er);
        }
        if(result.length !=0){
          return resolve(true);
        }
        return resolve(false);
    });
  });
}

//hier wird true oder false zurückgegeben
function checkCredentials(username,password) {
    var sql =`select * from users where mail ='${username}' and password='${password}'`;
  return  new Promise((resolve, reject)=>{
    var sql =`select * from users where mail ='${username}' and password='${password}'`;
    con.query(sql, function (err, result,fields) {
      
        if(err){
            return reject(err);
        }
        console.log(result)
        console.log(sql);
        if(result.length !=0){
          console.log("user existiert");
          console.log(result[0].mail);
          is = true;
          return resolve(true);
        }
        return resolve(false);
    });});
}
//hier wird user zurück gegeben 
function getUser(username,password) {
  return  new Promise((resolve, reject)=>{
    var sql =`select * from users where mail ='${username}' and password='${password}'`;
    con.query(sql, function (err, result,fields) {
      
        if(err){
            return reject(err);
        }

        if(result.length !=0){
          is = true;
          return resolve(result[0]);
        }
        return resolve(null);
    });
  });
}

//hier wird user zurück gegeben 
function getUserByUsername(username) {
  return  new Promise((resolve, reject)=>{
    var sql =`select * from users where mail ='${username}'`;
    con.query(sql, function (err, result,fields) {
      
        if(err){
            return reject(err);
        }
        console.log(result)
        console.log();
        if(result.length !=0){
          console.log("user existiert");
          return resolve(result[0]);
        }
        return resolve(null);
    });
  });
}


module.exports.getUserByUsername = getUserByUsername;
module.exports.getUser = getUser;
module.exports.checkCredentials = checkCredentials;
module.exports.isMailExisting = isMailExisting;
module.exports.createUser = createUser;
module.exports.createBilder = createBilder;
module.exports.getBilerByUserId = getBilerByUserId;
module.exports.updateBilder =updateBilder;

