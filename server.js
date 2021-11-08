const path = require("path");
const express = require("express");
const url = require('url');
const proxy = require('express-http-proxy');

// New hostname+path as specified by question:
const apiProxy = proxy('https://tamweelaqar.herokuapp.com', {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
});
const app = express();
app.use(express.static(__dirname + '/dist/tamweelaqar'));
app.get('/*', function(req,res){
res.sendFile(path.join(__dirname, '/dist/tamweelaqar', 'index.html'))
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
app.use('/api/*', apiProxy);