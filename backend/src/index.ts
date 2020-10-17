var express = require('express');
var bodyParser = require('body-parser')
var app = express(); 
 
var jsonParser = bodyParser.json()
 
import {createLobby, joinLobby} from "./lobby/session";

app.get('/api/status', (req,res) => { res.end("OK") })

app.post('/api/lobby/new', jsonParser, (req, res) => {
    var response = createLobby(req.body);
    res.end(JSON.stringify(response));
});

app.post('/api/lobby/join', jsonParser, (req, res) => {
    var response = joinLobby(req.body);
    res.end(JSON.stringify(response))
})

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
