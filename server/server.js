var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '../client')));

server.listen(port);