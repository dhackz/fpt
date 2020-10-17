import * as WebSocket from 'ws';

import { sessions } from "./session";

const wss = new WebSocket.Server({ port:8080 })

wss.on('open', (req,res) => {
    console.log('Game connection server!');
})

wss.on('connection', (ws,req) => {
    // Connection is either:
    // 1. game server registering endpoint for sessionId.
    // 2. client to registering to sessionId.
    //
    // if 1), register game server as available, respond with ready state?
    // if 2), check if session exists and join client to server. Notify server.
    //
    // Url is the only way to send data in the connection setup so that is what
    // we will use...
    const args = req.url.split('&');

    if (args.length != 2) {
        console.log(`Wrong number of arguments during connection! Expect url 
                    "to be of the form url:8080/sessionId&isClientOrServer`)
    } else {
        ws.close();
    }

    let sessionId = args[0];
    let isClientOrServer = args[1];

    // There should already be a valid session.
    let session = sessions[sessionId];

    console.log("New connection established!")

    switch (isClientOrServer) {
        case "client":
            //session.users.append(ws)
            ws.send("Game client have been registered yo.")
            break;
        case "server":
            //session.server = ws;
            ws.send("Game server have been registered yo.")
            break;
        default:
            console.log(sessionId)
            console.log(isClientOrServer)
            console.log("Something have been done goofed yo.")
            break;
    }
})

// The socket server don't know about the server 
wss.on('message', (data) => {
    console.log("Messages not supported yet, check back in next version.")
    console.log(data)
})
