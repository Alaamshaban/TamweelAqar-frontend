const path = require("path");
const express = require("express");
const url = require('url');
 const proxy = require('express-http-proxy');

const app = express();
app.use(express.static(__dirname + '/dist/tamweelaqar'));
// app.get('/*', function(req,res){
// res.sendFile(path.join(__dirname, 'dist/tamweelaqar', 'index.html'));
// })
app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname, 'dist/tamweelaqar', 'index.html'))
    }).use(proxy('https://tamweelaqar.herokuapp.com'))
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8085);