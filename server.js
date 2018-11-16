//routing, secure package
var express = require('express');
var helmet = require('helmet');
var session = require('express-session');

//node basic package
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');

//ssl key path
var option = {
    key: fs.readFileSync('../key/key.pem'),
    cert: fs.readFileSync('../key/cert.pem')
}

//using port number
var port1 = 80;  //http
var port2 = 443; //https

//express secure config section
var app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', 1)
app.use(session({ //session cookie config
    key:'sid',
    secret: 'hwajeon',
    name: 'sessionid',
    //store: sessionStore,
    proxy: true,
    resave: true,
    saveUninitialized: true
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
    var password = req.param("password")

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
}) //https : option -> ssl key data