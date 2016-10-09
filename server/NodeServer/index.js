var express = require('express');
var fs = require('fs');
var app = express();
var exec = require('exec');
var bodyParser = require('body-parser');
var child_process = require('child_process');
var needle = require("needle");
//var CircularJSON = require('circular-json')
var http = require('http');

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
  next();
});

// Create our Express router
var router = express.Router();
app.use('/', router);

app.get('/', function(req, res) {
  res.send('this is the metamap server index page.');
});

app.get('/consent',function(req,res){
	console.log("asking for me..");
	console.log(req);
 	res.send("I accept");
});

app.post('/consent',function(req,res){
	console.log("asking for me?");
	console.log(req);
	res.send("I accept");
});

app.get('/save', function(req, res){
	var mes = req.query.mes;
	var currentdate = new Date();
	var datetime = currentdate.getDay() + "/"+currentdate.getMonth() 
	+ "/" + currentdate.getFullYear() + " @ " 
	+ currentdate.getHours() + ":" 
	+ currentdate.getMinutes() + ":" + currentdate.getSeconds();
	fs.appendFile('log.txt', mes+",("+datetime+")\n", function (err) {
		res.send("Received: \""+mes+"\"");
	});
});

app.get('/show',function(req,res){
	fs.readFile('log.txt', function (err, txt) {
		console.log(err);
	    if (err) {
	        throw err; 
	    }
	    console.log(txt);       
	    res.write(txt);
	    res.end();
	});
})

var pings =0;
app.get("/trans",function(req,res){
	 var accessURL = "http://108.167.189.29/~saternius/tests/testy.php?text="+encodeURI(req.query.text)+"&to=es";
	 needle.get(accessURL,function(err,resp1){
		var body = resp1.body;
		body = body.substring(76,body.length);
		var ans = body.substring(0,body.length-11);
		console.log("ret: "+ans);
	 	res.send(ans);

	 });
	pings++;
	console.log(pings);
});

// Start the server
var server = app.listen(process.env.PORT || '8069', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address,
    server.address().port);
  console.log('Press Ctrl+C to quit.');
});
