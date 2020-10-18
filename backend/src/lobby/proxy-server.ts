import * as WebSocket from 'ws';

import { sessions } from "./session";

let createProxy = (tedis) => {
    const wss = new WebSocket.Server({ port:8081 })

    async function gameServerUpdate(ws, message) {
        if (await tedis.exists(message.sessionId)) {
            ws.send("No such sessionId exists!");
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
                break;
            default:
                console.log('Invalid action! Closing socket.')
                ws.send('Invalid action! Closing socket.')
                ws.close()
                break
        }
    }

    async function gameClientUpdate(ws: WebSocket, message) {
        if (await tedis.exists('session:'+message.sessionId)) {
            ws.send("No such sessionId exists!");
            return;
        }

        // There should already be a valid session.
        let session = tedis.get('session:'+message.sessionId);
        
        switch (message.action) {
            case 'register':
                session.socket = ws;
                break;
            case 'sendAll':
                break;
            case 'sendTo':
                break;
            default:
                console.log('Invalid action! Closing socket.')
                ws.send('Invalid action! Closing socket.')
                ws.close()
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
