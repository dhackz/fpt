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
  getEnvironmentVar("REDIS_HOST", "127.0.0.1")
);
const rpub = new Redis(
  6379,
  getEnvironmentVar("REDIS_HOST", "127.0.0.1")
);
const rsub = new Redis(
  6379,
  getEnvironmentVar("REDIS_HOST", "127.0.0.1")
);
rsub.on("message", (channel, message) => {
    console.log("Received message %s from channel %s", message, channel)
});



let express = require('express');
let bodyParser = require('body-parser')
let app = express();
 
let jsonParser = bodyParser.json()
 
import {createLobby, joinLobby, startGame} from "./lobby/session";
import {createProxy} from "./lobby/proxy-server";

app.get('/api/status', (req,res) => { res.end("OK") })

app.post('/api/lobby/new', jsonParser, (req, res) => {
    let response = createLobby(req.body, redis, rsub);
    res.end(JSON.stringify(response));
});

app.post('/api/lobby/join', jsonParser, (req, res) => {
    let response = joinLobby(req.body, redis, rsub, rpub);
    res.end(JSON.stringify(response))
})

app.post('/api/lobby/start', jsonParser, (req, res) => {
    let response = startGame(req.body, redis);
    res.end(JSON.stringify(response))
})

// Start the proxy server.
createProxy(redis)

let server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
