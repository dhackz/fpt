let express = require('express');
let bodyParser = require('body-parser')
let app = express();
 
let jsonParser = bodyParser.json()
 
import {createLobby, joinLobby, startGame} from "./lobby/session";

app.get('/api/status', (req,res) => { res.end("OK") })

app.post('/api/lobby/new', jsonParser, (req, res) => {
    let response = createLobby(req.body);
    res.end(JSON.stringify(response));
});

app.post('/api/lobby/join', jsonParser, (req, res) => {
    let response = joinLobby(req.body);
    res.end(JSON.stringify(response))
})

app.post('/api/lobby/start', jsonParser, (req, res) => {
    let response = startGame(req.body);
    res.end(JSON.stringify(response))
})

let server = app.listen(8080, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
