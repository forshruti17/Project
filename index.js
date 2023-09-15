var con = require("./connection");
var express =require('express');
var app=express();
const path = require('path');
const jwt= require("jsonwebtoken");
const secretKey="secretKey";



app.set('view engine' ,'ejs');


var bodyParser=require('body-parser');
const e = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

 


app.get('/addCat/:id', (req,res) =>{
    var category_name=req.query.category_name;
    var ParentCategory=req.query.ParentCategory;
    
    
    con.query("SELECT distinct category_name from nodeProject.category_manager where pid =0",[req.params.pid],(error,result)=>{
        if(error)throw error;
res.render("addCategory.ejs",{category:result});
});
});
app.post('/addCat', function(req,res) {
    var category_name = req.params.category_name;
    var pid = 0; 
    
    var ParentCategory = req.params.ParentCategory;
    
      if (ParentCategory) {
     
        con.query("SELECT id FROM category_manager WHERE category_name LIKE ?",'%' +ParentCategory + '%', (error, result) => {
          if (error) {
            throw error;
          }
          if (result.length > 0) 
        
            pid = result.id;
        
            });
    }
    else {
         pid = 0;
      }
      
        con.query("INSERT INTO category_manager(category_name,pid) VALUES(?,?)",[req.params.category_name, req.params.pid],(error,result)=>{
            if(error)throw error;
        
             
                res.render("search-cat.ejs",{category:result});
        });
    });

app.get('/search', (req, res) => {
    const searchQuery = req.query.term; 

con.query("SELECT a.id, a.category_name, b.category_name AS ParentCategory FROM category_manager AS a JOIN category_manager AS b ON b.id = a.pid WHERE a.category_name LIKE ?",[`%${searchQuery}%`],(error,result) =>{
    if(error)throw error;
      res.render('search-cat.ejs',{category:result});
                 });
          
            });

            app.delete('/delete/:id' , (req,resp) =>{
          con.query("DELETE FROM category_manager WHERE id =" +req.params.id ,(error,result)=>{
                    if(error)throw error;
            resp.send(result);
            });
            });
    
            app.patch('/edit/:id', (req,res) =>{
                const data=[req.body.category_name,req.params.id];
                con.query("UPDATE category_manager SET category_name=? WHERE id=?",data ,(error,result)=>{
                    if(error)
                    {
                        res.send('Error');
                    }
                    else{
            res.send(result);
                    }
            });
            });
            
 app.post("/login",(req,res)=> {
    const user ={
        id:1,
        username: "shruti",
        password: "pandey"
    }

    jwt.sign({user},secretKey,{expiresIn:'300s'},(err,token)=>{
        res.json({token})
     
        
    });
   

        });

        app.get("/login",(req,res)=> {
            res.render("login.ejs");
        })
        app.get("/register",(req,res)=> {
            res.render("register.ejs");
        })
        


        app.post("/profile",verifyToken ,(req,res)=>{
            jwt.verify(req.token,secretKey,(err,authData)=>{
                if(err){
                    res.send({result:"invalid token"})
                }
                else{
                    res.json({
                        messsage:"profile accessed",
                        authData
                    })
                }
            })

        })
        function verifyToken(req,res,next){
            const bearerHeader =req.headers['authorization'];
            if(typeof bearerHeader !== 'undefined'){
                const bearer =bearerHeader.split("");
                const token =bearer[1];
                req.token=token;
                next();

            }else{
                res.send({
                    result:'Token is not valid'
                })
            }
        }

        
     
        
        const port = 4000; 
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
        });
    




   
    







