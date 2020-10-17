var express = require('express');
var bodyParser = require('body-parser')
var app = express(); 
 
var jsonParser = bodyParser.json()
 
import createLobby from "./lobby/session";

app.post('/lobby/new', jsonParser, (req, res) => {
    console.log(req.body);
    var response = createLobby(req.body);
    res.end(JSON.stringify(response));
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
