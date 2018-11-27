//routing, secure package
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

//node basic package
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

//ssl key path
const option = {
    key: fs.readFileSync('../key/key.pem'),
    cert: fs.readFileSync('../key/cert.pem')
}

//sql connect module
const mysql      = require('mysql');
const dbconfig   = require('../key/dbconfig.js');
const connection = mysql.createConnection(dbconfig);

//using port number
const port1 = 80;  //http
const port2 = 443; //https

//express secure config section
const app = express();
app.use(helmet());
app.use(helmet.noCache());
app.disable('x-powered-by');
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', 1)
app.use(session({ //session cookie config
    key:'sid',
    secret: 'hwajeon',
    name: 'sessionID',
    store: new FileStore(),
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie:{
        secure: true,
        httpsOnly: true,
        domain: 'ec2-18-191-102-13.us-east-2.compute.amazonaws.com',
        expires: 1000*60*60
    }
}));

//express route config section
app.use(express.static(path.join(__dirname,'../html')));
app.use(function(req, res, next) { //if req need secure, auto route https connection
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

//html file path
app.get('', (req,res) => {
    res.sendFile(path.join(__dirname,'html','index.html'));
});

//control source section
//test page
app.get('/logintest', function (req, res){  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h3>Login</h3>');
    res.write('<form method="POST" action="/logintest">');
    res.write('<label name="userId">UserId : </label>')
    res.write('<input type="text" name="userId"><br/>');
    res.write('<label name="password">Password : </label>')
    res.write('<input type="password" name="password"><br/>');
    res.write('<input type="submit" name="login" value="Login">');
    res.write('</form>');
    res.end();
})
app.post('/logintest', function (req, res){  
    var userId = req.param("userId");
    var password = req.param("password");

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Thank you, '+userId+', you are now logged in.');
    res.write('<p><a href="/"> back home</a>');
    res.end();
});
//test section end

//server start section section
http.createServer(app).listen(port1, function(){
    console.log("Https is running at 80 port");
}) //http
https.createServer(option,app).listen(port2, function(){
    console.log("Https is running at 443 port");
    // mysql test command
    /*
    connection.connect();
    connection.query('SELECT * from persons', function(err, rows, fields) {
    if (!err)
      console.log('The solution is: ', rows);
    else
      console.log('Error while performing Query.', err);
    });
    connection.end();
    */
}) //https : option -> ssl key data