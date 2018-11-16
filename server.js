var express = require('express');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');

var option = {
    key: fs.readFileSync('../key/key.pem'),
    cert: fs.readFileSync('../key/cert.pem')
}

var port1 = 80;
var port2 = 443;

var app = express();
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'../html')));
app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

app.get('', (req,res) => {
    res.sendFile(path.join(__dirname,'html','index.html'));
});

app.get('/logintest', function (req, res){  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h3>Login</h3>');
    res.write('<form method="POST" action="/login">');
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

http.createServer(app).listen(port1, function(){
    console.log("Https is running at 80 port");
})

https.createServer(option,app).listen(port2, function(){
    console.log("Https is running at 443 port");
})