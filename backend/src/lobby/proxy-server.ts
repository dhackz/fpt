import * as WebSocket from 'ws';

import { sessions } from "./session";

const wss = new WebSocket.Server({ port:8081 })

function gameServerUpdate(ws, message) {
    if (!sessions.hasOwnProperty(message.sessionId)) {
        const error = "No such sessionId exists: " + message.sessionId
        ws.send(JSON.stringify({error}));
        console.log(sessions);
        return;
    }

    // There should already be a valid session.
    let session = sessions[message.sessionId];
    
    switch (message.action) {
        case 'register':
            console.log("New gameserver registered for %s", message.sessionId);
            session.socket = ws;
            break;
        case 'sendAll':
            break;
        case 'sendTo':
            break;
        default:
            const error = 'Invalid action! Closing socket.'
            console.log(error)
            ws.send(JSON.stringify({error}));
            ws.close()
            break
    }
}

function gameClientUpdate(ws, message) {
    if (!sessions.hasOwnProperty(message.sessionId)) {
        const error = "No such sessionId exists: " + message.sessionId
        ws.send(JSON.stringify({error}));
        console.log(sessions);
        return;
    }

    // There should already be a valid session.
    let session = sessions[message.sessionId];

    switch (message.action) {
        case 'register':
            session.players[message.userName] = ws;
            break;
        case 'sendAll':
            break;
        case 'sendTo':
            console.log("sending to " + message.target);
            break;
        default:
            const error = 'Invalid action! Closing socket.'
            console.log(error)
            ws.send(JSON.stringify({error}));
            break
    }
}

wss.on('connection', (ws,req) => {
    console.log('New client connected!')
    ws.send(JSON.stringify({
        connected: true,
    }));
    ws.on('message', (data: string) => {
        console.log(data)

        //TODO(dawidstrom): validate JSON data format.
        var message = JSON.parse(data);

        if (message.actor == "client") {
            gameClientUpdate(ws, message);
        } else if (message.actor == "server") {
            gameServerUpdate(ws, message);
        } else {
            console.log("Who tf is this?")
        }

        console.log("New connection established!");
    })
})

