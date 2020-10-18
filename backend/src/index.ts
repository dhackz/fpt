const Redis = require("ioredis");

function getEnvironmentVar(varname, defaultvalue)
{
    let result = process.env[varname];
    if(result!=undefined)
        return result;
    else
        return defaultvalue;
}

const redis = new Redis(
  6379,
  getEnvironmentVar("TEDIS_HOST", "127.0.0.1")
);


let express = require('express');
let bodyParser = require('body-parser')
let app = express();
 
let jsonParser = bodyParser.json()
 
import {createLobby, joinLobby, startGame} from "./lobby/session";

app.get('/api/status', (req,res) => { res.end("OK") })

app.post('/api/lobby/new', jsonParser, (req, res) => {
    let response = createLobby(req.body, redis);
    res.end(JSON.stringify(response));
});

app.post('/api/lobby/join', jsonParser, (req, res) => {
    let response = joinLobby(req.body, redis);
    res.end(JSON.stringify(response))
})

app.post('/api/lobby/start', jsonParser, (req, res) => {
    let response = startGame(req.body, redis);
    res.end(JSON.stringify(response))
})

let server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
