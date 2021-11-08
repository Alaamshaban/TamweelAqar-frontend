const path = require("path");
const express = require("express");
const app = express();
app.use(express.static(__dirname + '/dist/tamweelaqar'));
app.get('/*', function(req,res){
    request('https://tamweelaqar.herokuapp.com' , function (error, response, body) { 
        if (!error && response.statusCode === 200) { 
          console.log(body); 
          res.send(body); 
        } 
       }); 
res.sendFile(path.join(__dirname, '/dist/tamweelaqar', 'index.html'))
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);


app.get('/api', function(req, res){ 
    request('https://api.brewerydb.com/v2/?key=' + API_KEY, function (error, response, body) { 
      if (!error && response.statusCode === 200) { 
        console.log(body); 
        res.send(body); 
      } 
     }); 
  });