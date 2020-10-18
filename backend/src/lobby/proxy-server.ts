import { format } from 'path';
import * as WebSocket from 'ws';

import { sessions } from "./session";

let createProxy = (server, redis) => {
    const wss = new WebSocket.Server({server});

    async function gameServerUpdate(ws, message) {
        if (await redis.exists('session:'+message.sessionId)) {
            const error = "No such sessionId exists: " + message.sessionId;
            ws.send(JSON.stringify({error}));
            console.log(sessions);
            return;
        }

        console.log("found session..");

        // There should already be a valid session.
        let session = await redis.get('session:'+message.sessionId);
        console.log(session);
        switch (message.action) {
            case 'register':
                break;
            case 'sendAll':
                break;
            case 'sendTo':
                break;
            default:
                const error = `Invalid action: ${message}! Closing socket.`;
                console.log(error)
                ws.send(JSON.stringify({error}));
                ws.close()
                break
        }
    }

    async function gameClientUpdate(ws: WebSocket, message) {
        if (await redis.exists('session:'+message.sessionId)) {
            const error = "No such sessionId exists: " + message.sessionId
            ws.send(JSON.stringify({error}));
            console.log(sessions);
            return;
        }

        console.log("found session..");

        // There should already be a valid session.
        let session = await redis.get('session:'+message.sessionId);
        console.log(session);
        switch (message.action) {
            case 'register':
                break;
            case 'sendAll':
                break;
            case 'sendTo':
                break;
            default:
                const error = `Invalid action: ${message.action}! Closing socket.`;
                console.log(error)
                ws.send(JSON.stringify({error}));
                break
        }
    }

    wss.on('listening', () => {
        const addressInfo = wss.address();
        console.log('Proxy server started. Listening on ws://%s:%s',
                    addressInfo['address'],
                    addressInfo['port'])
    })


    wss.on('connection', (ws,req) => {
        console.log('New client connected!')
        ws.send(JSON.stringify({connected:true}));
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
}

export { createProxy };
