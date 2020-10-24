import { Logger } from "tslog";
const log: Logger = new Logger();

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

let http = require('http');
let express = require('express');
let bodyParser = require('body-parser')

let app = express();
let server = http.createServer(app); // Connect express routes to server.
 
let jsonParser = bodyParser.json()
 
import {initSessionHandler, createLobby, joinLobby, startGame} from "./lobby/session";
import {createProxy} from "./lobby/proxy-server";

app.get('/api/status', (req,res) => { res.end("OK") })

app.post('/api/lobby/new', jsonParser, (req, res) => {
    let response = createLobby(req.body, redis, rsub, log);
    res.end(JSON.stringify(response));
});

app.post('/api/lobby/join', jsonParser, (req, res) => {
    let response = joinLobby(req.body, redis, rsub, rpub, log);
    res.end(JSON.stringify(response))
})

app.post('/api/lobby/start', jsonParser, (req, res) => {
    let response = startGame(req.body, redis, log);
    res.end(JSON.stringify(response))
})

// Start the proxy server.
createProxy(server, redis, log)

server.listen(8080, () => {
    let host = server.address().address;
    let port = server.address().port;
    initSessionHandler(redis, rsub, rpub, log);
    log.info("App listening at http://"+host+":"+port);
})
