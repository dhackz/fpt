import { Tedis, TedisPool } from "tedis";

function getEnvironmentVar(varname, defaultvalue)
{
    let result = process.env[varname];
    if(result!=undefined)
        return result;
    else
        return defaultvalue;
}

const tedis = new Tedis({
  host: getEnvironmentVar("TEDIS_HOST", "127.0.0.1"),
  port: 6379
});


let express = require('express');
let bodyParser = require('body-parser')
let app = express();
 
let jsonParser = bodyParser.json()
 
import {createLobby, joinLobby, startGame} from "./lobby/session";
import {createProxy} from "./lobby/proxy-server";

app.get('/api/status', (req,res) => { res.end("OK") })

app.post('/api/lobby/new', jsonParser, (req, res) => {
    let response = createLobby(req.body, tedis);
    res.end(JSON.stringify(response));
});

app.post('/api/lobby/join', jsonParser, (req, res) => {
    let response = joinLobby(req.body, tedis);
    res.end(JSON.stringify(response))
})

app.post('/api/lobby/start', jsonParser, (req, res) => {
    let response = startGame(req.body, tedis);
    res.end(JSON.stringify(response))
})

// Start the proxy server.
createProxy(tedis)

let server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
