const { urlencoded } = require("body-parser");
const { name } = require("ejs");
const express = require("express");
const mysql = require("mysql");
var session=require('express-session');
const cookieparser = require('cookie-parser');
var app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static("styles"));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user",
  port: 3306,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});



app.get("/", (req, res) => {
  return res.render("home", {
  });
  
});

app.get("/profile", (req, res) => {


  return res.render("profile", {
  });
});


app.get("/reg", (req, res) => {
  res.render("reg");
});
app.get("/reg2", (req, res) => {
  res.render("reg2");
});
app.post("/register1", (req, res) => {
  eml = req.body.eml;
  psw = req.body.psw;
  sql1 = "SELECT * FROM info WHERE mail=?";

  con.query(sql1, [eml], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("Email ID already exists")
    }
    else{

  sql = "insert into info (id,mail,pass)values(?,?,?)";

  con.query(sql, [0, eml, psw], (err, result) => {
    if (err) throw err;

    res.render("login");
  });
}
});
});

app.post("/register2", (req, res) => {
  

  nam=req.body.name;
  dist=req.body.dist;
  numb=req.body.numb;
  eml=session.user;


  sql = "update info set name=?,district=?,number=? where mail=?";

  con.query(sql, [nam,dist,numb,eml], (err, result) => {
    if (err) throw err;

    res.render("profile",{'data':result});
  });
});


app.get("/login", (req, res) => {
  res.render("login");
})
;
app.get("/logout", (req, res) => {
  return res.redirect("/login");
});
app.post("/loginAction", (req, res) => {

  
  eml = req.body.eml;
  psw = req.body.psw;
  session.user=eml;
  session.passw=psw;
  
  sql = "SELECT * FROM info WHERE mail=? AND Pass=?";

  con.query(sql, [eml, psw], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      for (var i=0;i<result.length; i++){
        pname=result[i].name;
        console.log(pname)
      }
      if(pname==null){
        res.render("reg2");
      }
      else {
        res.render("profile",{'data':result})
      }
      
    } else {
      res.send("login not successfull");
    }
  });
});

app.post("/searchact", (req,res)=>{
  srch=req.body.search;
  var q="select * from info where name=?";
  con.query(q,[srch],(err,result)=>{
    if (err) throw err;
    
      res.render("profile",{'data':result});
    
  });
});


app.listen(8086, () => {
  console.log("http://localhost:8086/");
});
