import { format } from 'path';
import * as WebSocket from 'ws';

import { sessions } from "./session";

let createProxy = (server, redis) => {
    const wss = new WebSocket.Server({server});
    const PROXY_NAME ="WebSocketServer";

    let sessionExists = async (sessionId) => {
        console.log("%s: %s(): Asking Redis if session:%s exists...", PROXY_NAME, "sessionExists", sessionId);
        if (await redis.exists('session:'+sessionId)) {
            console.log("%s: %s(): session:%s found in redis.", PROXY_NAME, "sessionExists", sessionId);
            return true;
        }
        console.log("%s: %s(): session:%s found in redis.", PROXY_NAME, "sessionExists", sessionId);
        return false;
    }

    async function gameServerUpdate(ws, message) {
        let FUNC_NAME="gameServerUpdate";

        if (!sessionExists(message.sessionId)) {
            const error = "No such sessionId exists: " + message.sessionId;
            ws.send(JSON.stringify({error}));
        }

        // There should already be a valid session.
        let session = await redis.get('session:'+message.sessionId);
        console.log("%s: %s(): Result fetched session with id session: %s", PROXY_NAME, FUNC_NAME, session);

        switch (message.action) {
            case 'register':
                break;
            case 'sendAll':
                break;
            case 'sendTo':
                break;
            default:
                const error = `Invalid action: ${message}! Closing socket.`;
                console.log("%s(): session: %s", PROXY_NAME, FUNC_NAME, session);
                ws.send(JSON.stringify({error}));
                ws.close()
                break
        }
    }

    async function gameClientUpdate(ws: WebSocket, message) {
        let FUNC_NAME="gameClientUpdate";

        if (!sessionExists(message.sessionId)) {
            const error = "No such sessionId exists: " + message.sessionId;
            ws.send(JSON.stringify({error}));
            console.log("%s(): sessions: %s", PROXY_NAME, FUNC_NAME, sessions);
        }

        console.log("%s(): found session..", FUNC_NAME);

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
        console.log('%s: New client connected!', PROXY_NAME)
        ws.send(JSON.stringify({connected:true}));

        ws.on('message', (data: string) => {
            let FUNC_NAME = "message";
            console.log("%s: %s(): data: %s", PROXY_NAME, FUNC_NAME, data)

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
