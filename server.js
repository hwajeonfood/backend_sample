var express = require('express');
var path = require('path');
var app = express();
var http = require('http');

app.use(express.static(path.join(__dirname,'../html')));

app.get('', (req,res) => {
    res.sendFile(path.join(__dirname,'html','index.html'));
});

http.createServer(app).listen(80, function(){
    console.log("server is running at 80 port");
})